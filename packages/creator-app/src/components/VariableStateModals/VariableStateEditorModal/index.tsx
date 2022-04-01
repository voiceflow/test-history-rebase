import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, ButtonVariant, Input, toast } from '@voiceflow/ui';
import { useFormik } from 'formik';
import React from 'react';
import * as Yup from 'yup';

import BlockSelect from '@/components/BlockSelect';
import InputError from '@/components/InputError';
import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import Section from '@/components/Section';
import { SectionVariant } from '@/components/Section/constants';
import VariableList from '@/components/VariableList';
import VariablesSelect from '@/components/VariablesSelect';
import { FeatureFlag } from '@/config/features';
import { ModalType } from '@/constants';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as VariableStateDucks from '@/ducks/variableState';
import { useDispatch, useFeature, useHotKeys, useModals, useSelector, useTrackingEvents } from '@/hooks';
import { Hotkey } from '@/keymap';

import { InputHint, VariableListSection } from './components';

interface VariableStateEditorValues {
  name: string;
  stepID: string | null;
  diagramID: string | null;
  variables: string[];
  variablesValues: Record<string, string>;
}

const defaultValues: VariableStateEditorValues = {
  name: '',
  stepID: null,
  diagramID: null,
  variables: [],
  variablesValues: {},
};

const variableStateSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  variables: Yup.array().min(1, 'At least one variable is required').required('Variables is required'),
});

const getDiffValues = (variableState: Realtime.VariableState | null, values: VariableStateEditorValues) => {
  if (!variableState) return [];
  return Object.keys(
    Utils.object.getTopLevelDiff(
      { name: values.name, starting_block: values.stepID, variables: values.variablesValues },
      { name: variableState.name, starting_block: variableState.startFrom?.stepID || null, variables: variableState.variables }
    )
  );
};

const VariableStateEditorModal: React.FC = () => {
  const { isOpened, close, data } = useModals<{ variableStateID?: string }>(ModalType.VARIABLE_STATE_EDITOR_MODAL);
  const createVariableState = useDispatch(VariableStateDucks.createVariableState);
  const updateSelectedVariableState = useDispatch(VariableStateDucks.updateSelectedVariableState);
  const updateVariableState = useDispatch(VariableStateDucks.updateState);
  const getVariableStateByID = useSelector(VariableStateDucks.getVariableStateByIDSelector);
  const activeDiagramID = useSelector(CreatorV2.activeDiagramIDSelector);
  const [trackingEvents] = useTrackingEvents();
  const { isEnabled: isStartingBlockEnabled } = useFeature(FeatureFlag.VARIABLE_STATES_STARTING_BLOCKS);

  const initialValues = React.useMemo((): VariableStateEditorValues => {
    if (!data.variableStateID) return defaultValues;

    const variableState = getVariableStateByID({ id: data.variableStateID });

    if (!variableState) return defaultValues;

    return {
      name: variableState.name,
      diagramID: variableState.startFrom?.diagramID || null,
      stepID: variableState.startFrom?.stepID || null,
      variables: Object.keys(variableState.variables || {}),
      variablesValues: (variableState.variables as Record<string, string>) || {},
    };
  }, [data]);

  const onSubmit = async (values: VariableStateEditorValues) => {
    const diagramID = values.diagramID || activeDiagramID;
    const startFrom =
      values.stepID && diagramID
        ? {
            stepID: values.stepID,
            diagramID,
          }
        : null;

    const variables = values.variables.reduce((acc, variable) => {
      const formValue = values.variablesValues[variable];
      return { ...acc, [variable]: formValue || 0 };
    }, {});

    try {
      if (!data.variableStateID) {
        const createdVariableState = await createVariableState({ name: values.name, variables, startFrom });
        if (createdVariableState) updateSelectedVariableState({ id: createdVariableState.id, variables: values.variablesValues });
        trackingEvents.trackVariableStateCreated({ diagramID });
      } else {
        const variableState = getVariableStateByID({ id: data.variableStateID });
        const changedFields = getDiffValues(variableState, values);

        if (!changedFields.length) {
          close();
          return;
        }

        await updateVariableState(data.variableStateID, {
          name: values.name,
          variables: values.variablesValues,
          startFrom,
        });
        trackingEvents.trackVariableStateEdited({ editedFields: changedFields });
      }
      close();
    } catch (e) {
      toast.error('Failed to create variable state');
    }
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: variableStateSchema,
    onSubmit,
  });

  const variablesList = formik.values.variables.map((variable) => ({
    value: formik.values?.variablesValues[variable],
    name: variable,
  }));

  React.useEffect(() => {
    if (isOpened) {
      formik.resetForm({ values: initialValues, submitCount: 0 });
    }
  }, [isOpened]);

  useHotKeys(Hotkey.CLOSE_VARIABLE_STATE_EDITOR_MODAL, close, { preventDefault: true }, [close]);

  if (!isOpened) return null;

  return (
    <Modal id={ModalType.VARIABLE_STATE_EDITOR_MODAL} title="New Variable State">
      <ModalBody style={{ paddingBottom: 0, paddingLeft: 0, paddingRight: 0 }}>
        <Section header="Name" variant={SectionVariant.FORM} customHeaderStyling={{ paddingTop: 8 }}>
          <Input
            name="name"
            onChange={formik.handleChange}
            value={formik.values.name}
            error={!!formik.submitCount && !!formik.errors.name}
            placeholder="E.g., New User, Return User, Added Credit Card"
            onEnterPress={formik.submitForm}
            disabled={formik.isSubmitting}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
          {!!formik.submitCount && formik.errors.name && <InputError>{formik.errors.name}</InputError>}
        </Section>
        {isStartingBlockEnabled && (
          <Section header="Starting Block" variant={SectionVariant.FORM}>
            <BlockSelect onChange={(stepID) => formik.setFieldValue('stepID', stepID)} value={formik.values.stepID} disabled={formik.isSubmitting} />
            <InputHint>Select a block where this conversation will start from</InputHint>
          </Section>
        )}
        <Section header="Variables" variant={SectionVariant.FORM}>
          <VariablesSelect
            onChange={(value: string[]) => formik.setFieldValue('variables', value)}
            error={!!formik.submitCount && !!formik.errors.variables}
            value={formik.values.variables}
            placeholder="Select variables to include"
            disabled={formik.isSubmitting}
          />
          {!!formik.submitCount && formik.errors.variables && <InputError>{formik.errors.variables}</InputError>}
        </Section>
        {formik.values.variables.length > 0 && (
          <Section customContentStyling={{ padding: 0 }} variant={SectionVariant.FORM}>
            <VariableListSection>
              <VariableList
                disabled={formik.isSubmitting}
                canDelete
                onChangeList={(list) => {
                  formik.setValues((state) => ({
                    ...state,
                    variables: list.map(({ name }) => name),
                    variablesValues: list.reduce((acc, next) => ({ ...acc, [next.name]: next.value }), {}),
                  }));
                }}
                variables={variablesList}
              />
            </VariableListSection>
          </Section>
        )}
      </ModalBody>

      <ModalFooter>
        <Box mr="12px">
          <Button variant={ButtonVariant.TERTIARY} squareRadius onClick={close} disabled={formik.isSubmitting}>
            Cancel
          </Button>
        </Box>

        <Button variant={ButtonVariant.PRIMARY} squareRadius disabled={formik.isSubmitting} onClick={formik.submitForm}>
          Save State
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default VariableStateEditorModal;

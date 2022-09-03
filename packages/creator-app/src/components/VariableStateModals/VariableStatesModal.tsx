import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, ButtonVariant, Input, toast } from '@voiceflow/ui';
import { useFormik } from 'formik';
import React from 'react';

import BlockSelect from '@/components/BlockSelect';
import InputError from '@/components/InputError';
import Modal, { ModalFooter } from '@/components/Modal';
import Section from '@/components/Section';
import { SectionVariant } from '@/components/Section/constants';
import VariableList from '@/components/VariableList';
import VariablesSelect from '@/components/VariablesSelect';
import { ModalType } from '@/constants';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as VariableState from '@/ducks/variableState';
import { useDispatch, useModals, useSelector, useTrackingEvents } from '@/hooks';

import { InputHint, VariableListSection } from './components';
import { defaultValues, variableStateSchema } from './constants';
import { VariableStateEditorValues } from './types';

const getDiffValues = (variableState: Realtime.VariableState | null, values: VariableStateEditorValues) => {
  if (!variableState) return [];
  return Object.keys(
    Utils.object.getTopLevelDiff(
      { name: values.name, starting_block: values.startFrom?.stepID, variables: values.variablesValues },
      { name: variableState.name, starting_block: variableState.startFrom?.stepID || null, variables: variableState.variables }
    )
  );
};

const VariableStatesModal: React.FC<{
  modalType: ModalType;
  saveText: string;
  title: string;
  headerActions?: React.ReactNode;
}> = ({ modalType, saveText, title, headerActions }) => {
  const { isOpened, data } = useModals<{ variableStateID?: string }>(modalType);
  const { close } = useModals(modalType);

  const [trackingEvents] = useTrackingEvents();

  const getVariableStateByID = useSelector(VariableState.getVariableStateByIDSelector);
  const activeDiagramID = useSelector(CreatorV2.activeDiagramIDSelector);

  const createVariableState = useDispatch(VariableState.createVariableState);
  const updateVariableState = useDispatch(VariableState.updateState);

  const initialValues = React.useMemo((): VariableStateEditorValues => {
    if (!data.variableStateID) return defaultValues;

    const variableState = getVariableStateByID({ id: data.variableStateID });

    if (!variableState) return defaultValues;

    return {
      name: variableState.name,
      startFrom: variableState.startFrom || null,
      variables: Object.keys(variableState.variables || {}),
      variablesValues: (variableState.variables as Record<string, string>) || {},
    };
  }, [data]);

  const onSubmit = async (values: VariableStateEditorValues) => {
    const startFrom = values.startFrom || null;

    const variables = values.variables.reduce((acc, variable) => {
      const formValue = values.variablesValues[variable];
      return { ...acc, [variable]: formValue || 0 };
    }, {});

    try {
      if (!data.variableStateID) {
        await createVariableState({ name: values.name, variables, startFrom });
        trackingEvents.trackVariableStateCreated({ diagramID: startFrom?.diagramID || activeDiagramID });
      } else {
        const variableState = getVariableStateByID({ id: data.variableStateID });

        values.variables.forEach((variable) => {
          if (values.variablesValues[variable] === undefined) {
            values.variablesValues[variable] = '';
          }
        });

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

  const variablesList = React.useMemo(
    () =>
      formik.values.variables.map((variable) => ({
        value: formik.values.variablesValues[variable],
        name: variable,
      })),
    [formik.values.variables, formik.values.variablesValues]
  );

  React.useEffect(() => {
    if (isOpened) {
      formik.resetForm({ values: initialValues, submitCount: 0 });
    }
  }, [isOpened]);

  return (
    <Modal id={modalType} title={title} headerActions={headerActions} verticalMargin={32} maxWidth={450}>
      <Box fullWidth>
        <Section header="Name" dividers forceDividers variant={SectionVariant.TERTIARY_TITLE}>
          <Input
            name="name"
            onChange={formik.handleChange}
            value={formik.values.name}
            error={!!formik.submitCount && !!formik.errors.name}
            placeholder="E.g., New User, Return User, Added Credit Card"
            onEnterPress={formik.submitForm}
            disabled={formik.isSubmitting}
            autoFocus
          />
          {!!formik.submitCount && formik.errors.name && <InputError>{formik.errors.name}</InputError>}
        </Section>
        <Section header="Starting Block" dividers={false} variant={SectionVariant.TERTIARY_TITLE}>
          <BlockSelect
            value={formik.values.startFrom}
            onChange={(startFrom) => formik.setFieldValue('startFrom', startFrom)}
            disabled={formik.isSubmitting}
            startNodeIsDefault
          />
        </Section>
        <Box pb={formik.values.variables.length > 0 ? 16 : 32}>
          <Section header="Variables" dividers={false} variant={SectionVariant.TERTIARY_TITLE}>
            <VariablesSelect
              onChange={(value: string[]) => formik.setFieldValue('variables', value)}
              error={!!formik.submitCount && !!formik.errors.variables}
              value={formik.values.variables}
              placeholder="Select variables to include"
              disabled={formik.isSubmitting}
            />
            {formik.values.variables.length === 0 && (!formik.errors.variables || formik.submitCount === 0) && (
              <InputHint>Selected variables will be shown below to set values.</InputHint>
            )}
            {!!formik.submitCount && formik.errors.variables && <InputError>{formik.errors.variables}</InputError>}
          </Section>
        </Box>

        {formik.values.variables.length > 0 && (
          <Section customContentStyling={{ padding: 0 }} dividers isDividerNested variant={SectionVariant.TERTIARY}>
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
      </Box>

      <ModalFooter>
        <Box mr="12px">
          <Button variant={ButtonVariant.TERTIARY} squareRadius onClick={close} disabled={formik.isSubmitting}>
            Cancel
          </Button>
        </Box>

        <Button variant={ButtonVariant.PRIMARY} squareRadius disabled={formik.isSubmitting} onClick={formik.submitForm}>
          {saveText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default VariableStatesModal;

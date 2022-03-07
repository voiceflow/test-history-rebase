import { Utils } from '@voiceflow/common';
import { Box, Button, ButtonVariant, Input, toast } from '@voiceflow/ui';
import React from 'react';

import BlockSelect from '@/components/BlockSelect';
import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import Section from '@/components/Section';
import { SectionVariant } from '@/components/Section/constants';
import VariableList from '@/components/VariableList';
import VariablesSelect from '@/components/VariablesSelect';
import { ModalType } from '@/constants';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as VariableStateDucks from '@/ducks/variableState';
import { useDispatch, useModals, useSelector, useTrackingEvents } from '@/hooks';

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

const VariableStateEditorModal: React.FC = () => {
  const { isOpened, close, data } = useModals<{ variableStateID?: string }>(ModalType.VARIABLE_STATE_EDITOR_MODAL);
  const createVariableState = useDispatch(VariableStateDucks.createVariableState);
  const updateSelectedVariableState = useDispatch(VariableStateDucks.updateSelectedVariableState);
  const updateVariableState = useDispatch(VariableStateDucks.updateState);
  const getVariableStateByID = useSelector(VariableStateDucks.getVariableStateByIDSelector);
  const activeDiagramID = useSelector(CreatorV2.activeDiagramIDSelector);
  const [trackingEvents] = useTrackingEvents();

  const getInitialValues = (): VariableStateEditorValues => {
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
  };

  const [saving, setSaving] = React.useState(false);
  const [values, setValues] = React.useState<VariableStateEditorValues>(getInitialValues);
  const variablesList = values.variables.map((variable) => ({
    value: values?.variablesValues[variable],
    name: variable,
  }));

  const getDiffValues = () => {
    const variableState = getVariableStateByID({ id: data.variableStateID });
    if (!variableState) return [];
    return Object.keys(
      Utils.object.getTopLevelDiff(
        { name: values.name, starting_block: values.stepID, variables: values.variablesValues },
        { name: variableState.name, starting_block: variableState.startFrom?.stepID || null, variables: variableState.variables }
      )
    );
  };

  const validateFields = () => {
    if (!values.name) {
      toast.error('Name is required');
      return false;
    }

    if (!values.variables.length) {
      toast.error('At least one variable is required');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    const diagramID = values.diagramID || activeDiagramID;
    const startFrom =
      values.stepID && diagramID
        ? {
            stepID: values.stepID,
            diagramID,
          }
        : null;

    const isValid = validateFields();

    if (!isValid) return;

    setSaving(true);

    try {
      if (!data.variableStateID) {
        const createdVariableState = await createVariableState({ name: values.name, variables: values.variablesValues, startFrom });
        if (createdVariableState) updateSelectedVariableState({ id: createdVariableState.id, variables: values.variablesValues });
        trackingEvents.trackVariableStateCreated({ diagramID });
      } else {
        const changedFields = getDiffValues();

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
    } finally {
      setSaving(false);
    }
  };

  const onChangeValue =
    (name: string) =>
    <T extends unknown>(value: T) =>
      setValues((state) => ({ ...state, [name]: value }));

  React.useEffect(() => {
    setSaving(false);
    setValues(getInitialValues);
  }, [isOpened]);

  if (!isOpened) return null;

  return (
    <Modal id={ModalType.VARIABLE_STATE_EDITOR_MODAL} title="New Variable State">
      <ModalBody style={{ paddingBottom: 0, paddingLeft: 0, paddingRight: 0 }}>
        <Section header="Name" variant={SectionVariant.FORM} customHeaderStyling={{ paddingTop: 8 }}>
          <Input
            onChangeText={onChangeValue('name')}
            value={values.name}
            placeholder="E.g., New User, Return User, Added Credit Card"
            onEnterPress={handleSave}
            disabled={saving}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </Section>
        <Section header="Starting Block" variant={SectionVariant.FORM}>
          <BlockSelect onChange={onChangeValue('stepID')} value={values.stepID} disabled={saving} />
          <InputHint>Select a block where this conversation will start from</InputHint>
        </Section>
        <Section header="Variables" variant={SectionVariant.FORM}>
          <VariablesSelect
            onChange={onChangeValue('variables')}
            value={values.variables}
            placeholder="Select variables to include"
            disabled={saving}
          />
          {!values.variables.length && <InputHint>Selected variables will be shown below to set values</InputHint>}
        </Section>
        {values.variables.length > 0 && (
          <Section customContentStyling={{ padding: 0 }} variant={SectionVariant.FORM}>
            <VariableListSection>
              <VariableList
                disabled={saving}
                canDelete
                onChangeList={(list) => {
                  setValues((state) => ({
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
          <Button variant={ButtonVariant.TERTIARY} squareRadius onClick={close} disabled={saving}>
            Cancel
          </Button>
        </Box>

        <Button variant={ButtonVariant.PRIMARY} squareRadius disabled={saving} onClick={handleSave}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default VariableStateEditorModal;

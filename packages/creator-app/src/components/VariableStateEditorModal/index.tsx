import { Button, Input, Link, toast } from '@voiceflow/ui';
import React from 'react';

import BlockSelect from '@/components/BlockSelect';
import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import Section from '@/components/Section';
import { SectionVariant } from '@/components/Section/constants';
import VariableList from '@/components/VariableList';
import VariablesSelect from '@/components/VariablesSelect';
import { ModalType } from '@/constants';
import * as Session from '@/ducks/session';
import * as VariableStateDucks from '@/ducks/variableState';
import { useDispatch, useModals, useSelector, useTrackingEvents } from '@/hooks';

import { InputHint } from './components';

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
  const updateVariableState = useDispatch(VariableStateDucks.updateState);
  const getVariableStateById = useSelector(VariableStateDucks.variableStatesByIDsSelector);
  const activeDiagramID = useSelector(Session.activeDiagramIDSelector);
  const [trackingEvents] = useTrackingEvents();

  const getInitialValues = (): VariableStateEditorValues => {
    if (!data.variableStateID) return defaultValues;

    const variableState = getVariableStateById(data.variableStateID);

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

  React.useEffect(() => {
    setSaving(false);
    setValues(getInitialValues);
  }, [isOpened]);

  const handleSave = async () => {
    const diagramID = values.diagramID || activeDiagramID;
    const startFrom =
      values.stepID && diagramID
        ? {
            stepID: values.stepID,
            diagramID,
          }
        : null;

    if (Object.values(values.variablesValues).some((value) => !value)) {
      toast.error('One or more included variables are not set');
      return;
    }

    setSaving(true);

    if (!data.variableStateID) {
      await createVariableState({ name: values.name, variables: values.variablesValues, startFrom });
      trackingEvents.trackVariableStateCreated({ diagramID });
    } else {
      await updateVariableState(data.variableStateID, {
        name: values.name,
        variables: values.variablesValues,
        startFrom,
      });
    }

    setSaving(false);
    close();
  };

  const onChangeValue =
    (name: string) =>
    <T extends unknown>(value: T) =>
      setValues((state) => ({ ...state, [name]: value }));

  if (!isOpened) return null;

  const variablesList = values.variables.map((variable) => ({
    value: values?.variablesValues[variable],
    name: variable,
  }));

  return (
    <Modal id={ModalType.VARIABLE_STATE_EDITOR_MODAL} title="New Variable State">
      <ModalBody style={{ paddingBottom: 8, paddingLeft: 0, paddingRight: 0 }}>
        <Section header="Name" variant={SectionVariant.FORM} customHeaderStyling={{ paddingTop: 8 }}>
          <Input
            onChangeText={onChangeValue('name')}
            value={values.name}
            placeholder="E.g., New User, Return User, Added Credit Card"
            onEnterPress={handleSave}
            disabled={saving}
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
            placeholder="E.g., New User, Return User, Added Credit Card"
            disabled={saving}
          />
          <InputHint>Selected variables will be shown below to set values</InputHint>
        </Section>
        <Section variant={SectionVariant.FORM} customContentStyling={{ paddingBottom: 0 }}>
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
        </Section>
      </ModalBody>

      <ModalFooter>
        <Link onClick={() => close()} style={{ marginRight: '33px', fontWeight: 600 }}>
          Cancel
        </Link>

        <Button disabled={saving} onClick={handleSave}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default VariableStateEditorModal;

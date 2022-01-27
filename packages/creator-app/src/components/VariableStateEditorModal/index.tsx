import { Button, Input, Link } from '@voiceflow/ui';
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
  stepId: string | null;
  variables: string[];
  variablesValues: Record<string, string>;
}

const defaultValues: VariableStateEditorValues = {
  name: '',
  stepId: null,
  variables: [],
  variablesValues: {},
};

const VariableStateEditorModal: React.FC = () => {
  const { isOpened, close } = useModals(ModalType.VARIABLE_STATE_EDITOR_MODAL);
  const [values, setValues] = React.useState(defaultValues);
  const [saving, setSaving] = React.useState(false);

  const diagramID = useSelector(Session.activeDiagramIDSelector);

  const createVariableState = useDispatch(VariableStateDucks.createVariableState);
  const [trackingEvents] = useTrackingEvents();

  const handleSave = async () => {
    setSaving(true);

    await createVariableState({
      name: values.name,
      stepID: values.stepId,
      variables: values.variablesValues,
    });
    trackingEvents.trackVariableStateCreated({ diagramID });
    setSaving(true);
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
          <Input onChangeText={onChangeValue('name')} placeholder="E.g., New User, Return User, Added Credit Card" onEnterPress={handleSave} />
        </Section>
        <Section header="Starting Block" variant={SectionVariant.FORM}>
          <BlockSelect onChange={onChangeValue('stepId')} value={values.stepId} />
          <InputHint>Select a block where this conversation will start from</InputHint>
        </Section>
        <Section header="Variables" variant={SectionVariant.FORM}>
          <VariablesSelect
            onChange={onChangeValue('variables')}
            value={values.variables}
            placeholder="E.g., New User, Return User, Added Credit Card"
          />
          <InputHint>Selected variables will be shown below to set values</InputHint>
        </Section>
        <Section variant={SectionVariant.FORM} customContentStyling={{ paddingBottom: 0 }}>
          <VariableList
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

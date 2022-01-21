import { Button, Input, Link } from '@voiceflow/ui';
import React from 'react';

import BlockSelect from '@/components/BlockSelect';
import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import Section from '@/components/Section';
import { SectionVariant } from '@/components/Section/constants';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';

import { InputHint } from './components';

interface VariableStateCreationValues {
  name: string;
  startBlock: string | null;
  variables: string[];
  variablesValues: Record<string, string>;
}

const defaultValues: VariableStateCreationValues = {
  name: '',
  startBlock: null,
  variables: [],
  variablesValues: {},
};

const VariableStateCreationModal: React.FC = () => {
  const { isOpened, close } = useModals(ModalType.VARIABLE_STATE_EDITOR_MODAL);
  const [values, setValues] = React.useState(defaultValues);
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    setSaving(true);
  };

  const onChangeText = (name: string) => (value: unknown) => setValues((state) => ({ ...state, [name]: value }));

  if (!isOpened) return null;

  return (
    <Modal id={ModalType.VARIABLE_STATE_EDITOR_MODAL} title="New Variable State">
      <ModalBody style={{ paddingBottom: 8, paddingLeft: 0, paddingRight: 0 }}>
        <Section header="Name" variant={SectionVariant.FORM} customHeaderStyling={{ paddingTop: 8 }}>
          <Input onChangeText={onChangeText('name')} placeholder="E.g., New User, Return User, Added Credit Card" onEnterPress={handleSave} />
        </Section>
        <Section header="Starting Block" variant={SectionVariant.FORM}>
          <BlockSelect onChange={onChangeText('startBlock')} value={values.startBlock} />
          <InputHint>Select a block where this conversation will start from</InputHint>
        </Section>
        <Section header="Variables" variant={SectionVariant.FORM}>
          <Input onChangeText={onChangeText('name')} placeholder="E.g., New User, Return User, Added Credit Card" onEnterPress={handleSave} />
          <InputHint>Selected variables will be shown below to set values</InputHint>
        </Section>
      </ModalBody>

      <ModalFooter>
        <Link onClick={() => close()} style={{ marginRight: '33px', fontWeight: 600 }}>
          Cancel
        </Link>

        <Button disabled={saving} onClick={handleSave}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default VariableStateCreationModal;

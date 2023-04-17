import { Divider, Input } from '@voiceflow/ui';
import React from 'react';

import Section from '@/components/Section';
import { useLinkedState } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';

interface FollowPathEditorProps {
  name?: string;
  onChange: (name: string) => void;
}

const FollowPathEditor: React.FC<FollowPathEditorProps> = ({ name, onChange }) => {
  const [localName, setLocalName] = useLinkedState(name ?? '');

  const onSave = () => onChange(localName);

  return (
    <>
      <Section>
        <FormControl label="Path Label" contentBottomUnits={0}>
          <Input value={localName} onBlur={onSave} onChangeText={setLocalName} placeholder="Add path label" onEnterPress={onSave} />
        </FormControl>
      </Section>

      <Divider />
    </>
  );
};

export default FollowPathEditor;

import { Input } from '@voiceflow/ui';
import React from 'react';

import Section from '@/components/Section';
import { useLinkedState } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { getTargetValue, withEnterPress } from '@/utils/dom';

interface NoMatchPathEditorProps {
  name: string;
  onChange: (name: string) => void;
}

const NoMatchPathEditor: React.FC<NoMatchPathEditorProps> = ({ name, onChange }) => {
  const [localName, setLocalName] = useLinkedState(name);

  const onSave = () => onChange(localName);

  return (
    <Section borderBottom>
      <FormControl label="Path Label" contentBottomUnits={0}>
        <Input
          value={localName}
          onBlur={onSave}
          onChange={getTargetValue(setLocalName)}
          onKeyPress={withEnterPress(onSave)}
          placeholder="Add path label"
        />
      </FormControl>
    </Section>
  );
};

export default NoMatchPathEditor;

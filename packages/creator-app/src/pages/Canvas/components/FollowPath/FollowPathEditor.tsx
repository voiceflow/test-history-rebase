import { Input } from '@voiceflow/ui';
import React from 'react';

import Divider from '@/components/Divider';
import Section from '@/components/Section';
import { useLinkedState } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { withEnterPress, withTargetValue } from '@/utils/dom';

interface FollowPathEditorProps {
  name: string;
  onChange: (name: string) => void;
}

const FollowPathEditor: React.FC<FollowPathEditorProps> = ({ name, onChange }) => {
  const [localName, setLocalName] = useLinkedState(name);

  const onSave = () => onChange(localName);

  return (
    <>
      <Section isDividerNested>
        <FormControl label="Path Label" contentBottomUnits={0}>
          <Input
            value={localName}
            onBlur={onSave}
            onChange={withTargetValue(setLocalName)}
            onKeyPress={withEnterPress(onSave)}
            placeholder="Add path label"
          />
        </FormControl>
      </Section>
      <Divider offset={0} />
    </>
  );
};

export default FollowPathEditor;

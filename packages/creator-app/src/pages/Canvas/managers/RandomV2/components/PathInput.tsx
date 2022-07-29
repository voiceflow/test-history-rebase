import { Input, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { RemoveBox } from './styles';

interface PathName {
  label: string;
}

interface PathInputProps {
  pathName: string;
  onUpdate: (path: PathName) => void;
  onRemove: VoidFunction;
  removeDisabled?: boolean;
}

const PathInput: React.FC<PathInputProps> = ({ pathName, onUpdate, onRemove, removeDisabled = false }) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <SectionV2.ListItem
      action={
        <RemoveBox>
          <SectionV2.RemoveButton onClick={onRemove} disabled={removeDisabled} />
        </RemoveBox>
      }
    >
      <Input ref={inputRef} value={pathName} onChangeText={(value: string) => onUpdate({ label: value })} />
    </SectionV2.ListItem>
  );
};

export default PathInput;

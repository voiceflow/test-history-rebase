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
  const update = React.useCallback((value: string) => onUpdate({ label: value }), [onUpdate]);

  return (
    <SectionV2.ListItem
      action={
        <RemoveBox>
          <SectionV2.RemoveButton onClick={onRemove} disabled={removeDisabled} />
        </RemoveBox>
      }
    >
      <Input ref={inputRef} value={pathName} onChangeText={update} />
    </SectionV2.ListItem>
  );
};

export default PathInput;

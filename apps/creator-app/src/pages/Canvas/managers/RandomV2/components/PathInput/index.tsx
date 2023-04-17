import { Input, SectionV2, withInputBlur } from '@voiceflow/ui';
import React from 'react';

import { useLinkedState } from '@/hooks';

import * as S from './styles';

interface PathInputProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: VoidFunction;
  removeDisabled?: boolean;
}

const PathInput: React.FC<PathInputProps> = ({ value: propValue, onChange, onRemove, removeDisabled = false }) => {
  const [value, setValue] = useLinkedState(propValue);

  return (
    <SectionV2.ListItem
      action={
        <S.RemoveContainer>
          <SectionV2.RemoveButton onClick={onRemove} disabled={removeDisabled} />
        </S.RemoveContainer>
      }
    >
      <Input value={value} onBlur={() => onChange(value)} onChangeText={setValue} onEnterPress={withInputBlur()} />
    </SectionV2.ListItem>
  );
};

export default PathInput;

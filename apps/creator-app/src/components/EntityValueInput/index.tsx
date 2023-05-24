import * as Realtime from '@voiceflow/realtime-sdk';
import { preventDefault, useLinkedState, withInputBlur } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

interface EntityValueInputProps {
  entity: Realtime.SlotInput;
  isActive?: boolean;
  readOnly?: boolean;
  onChange: (data: Omit<Realtime.SlotInput, 'id'>) => void;
}

const EntityValueInput: React.FC<EntityValueInputProps> = ({ entity, readOnly, isActive, onChange }) => {
  const [isFocused, setFocused] = React.useState(false);
  const [localValue, setLocalValue] = useLinkedState(entity.value);
  const [localSynonyms, setLocalSynonyms] = useLinkedState(entity.synonyms);

  const onBlur = () => {
    onChange({ value: localValue, synonyms: localSynonyms });
    setFocused(false);
  };

  return (
    <S.Container isActive={isActive || isFocused} onBlurCapture={onBlur} onFocusCapture={() => setFocused(true)}>
      <S.ValueInput
        value={localValue}
        readOnly={readOnly}
        placeholder="Value"
        onChangeText={setLocalValue}
        onEnterPress={preventDefault(withInputBlur())}
      />

      <S.SynonymsInput
        value={localSynonyms}
        readOnly={readOnly}
        placeholder="Add synonyms"
        onChangeText={setLocalSynonyms}
        onEnterPress={preventDefault(withInputBlur())}
      />
    </S.Container>
  );
};

export default EntityValueInput;

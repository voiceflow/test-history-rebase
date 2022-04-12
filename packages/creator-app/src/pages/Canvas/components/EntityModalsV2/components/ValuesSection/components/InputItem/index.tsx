import * as Realtime from '@voiceflow/realtime-sdk';
import { useOnClickOutside } from '@voiceflow/ui';
import React from 'react';

import { Container, SynonymsInput, ValueInput } from './components';

interface InputItemProps {
  slotInput: Realtime.SlotInput;
  onUpdateItem: (data: { synonyms: string; value: string }) => void;
}

const InputItem: React.FC<InputItemProps> = ({ onUpdateItem, slotInput }) => {
  const [localValue, setLocalValue] = React.useState(slotInput.value);
  const [active, setActive] = React.useState(false);
  const [localSynonyms, setLocalSynonyms] = React.useState(slotInput.synonyms);

  const synonymsInputRef = React.useRef<HTMLInputElement>(null);
  const valuesInputRef = React.useRef<HTMLInputElement>(null);

  const inputsRef = React.useRef(null);

  useOnClickOutside(
    inputsRef,
    () => {
      if (!active) return;
      onUpdateItem({ value: localValue, synonyms: localSynonyms });
      setActive(false);
    },
    [localSynonyms, localValue, active]
  );

  const handleInputFocus = () => {
    setActive(true);
  };

  return (
    <Container active={active} ref={inputsRef}>
      <ValueInput
        value={localValue}
        placeholder="Value"
        onEnterPress={() => valuesInputRef.current?.blur()}
        onFocus={handleInputFocus}
        onChangeText={setLocalValue}
      />
      <SynonymsInput
        ref={synonymsInputRef}
        onFocus={handleInputFocus}
        placeholder="Add synonyms"
        value={localSynonyms}
        onChangeText={setLocalSynonyms}
        onEnterPress={() => synonymsInputRef.current?.blur()}
      />
    </Container>
  );
};

export default InputItem;

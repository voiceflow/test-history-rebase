import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { Container, SynonymsInput, ValueInput } from './components';

interface InputItemProps {
  slotInput: Realtime.SlotInput;
  onUpdateSynonym: (synonyms: string) => void;
  onUpdateValue: (value: string) => void;
}

const InputItem: React.FC<InputItemProps> = ({ onUpdateValue, onUpdateSynonym, slotInput }) => {
  const [localValue, setLocalValue] = React.useState(slotInput.value);

  const [localSynonyms, setLocalSynonyms] = React.useState(slotInput.synonyms);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSynonymChange = () => {
    onUpdateSynonym(localSynonyms);
  };

  const handleValueChange = () => {
    onUpdateValue(localValue);
  };

  const handleOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    e.preventDefault();
    target.setSelectionRange(target.value.length, target.value.length);
  };

  return (
    <Container>
      <ValueInput
        value={localValue}
        placeholder="Value"
        onEnterPress={() => inputRef.current?.blur()}
        onChangeText={setLocalValue}
        onBlur={handleValueChange}
      />
      <SynonymsInput
        ref={inputRef}
        onFocus={handleOnFocus}
        onBlur={handleSynonymChange}
        placeholder="Add synonyms"
        value={localSynonyms}
        onChangeText={setLocalSynonyms}
        onEnterPress={() => inputRef.current?.blur()}
      />
    </Container>
  );
};

export default InputItem;

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
  const [active, setActive] = React.useState(false);
  const [localSynonyms, setLocalSynonyms] = React.useState(slotInput.synonyms);

  const synonymsInputRef = React.useRef<HTMLInputElement>(null);
  const valuesInputRef = React.useRef<HTMLInputElement>(null);

  const handleSynonymChange = () => {
    onUpdateSynonym(localSynonyms);
    setActive(false);
  };

  const handleValueChange = () => {
    onUpdateValue(localValue);
    setActive(false);
  };

  const handleInputFocus = () => {
    setActive(true);
  };

  return (
    <Container active={active}>
      <ValueInput
        value={localValue}
        placeholder="Value"
        onEnterPress={() => {
          valuesInputRef.current?.blur();
        }}
        onFocus={handleInputFocus}
        onChangeText={setLocalValue}
        onBlur={handleValueChange}
      />
      <SynonymsInput
        ref={synonymsInputRef}
        onFocus={handleInputFocus}
        onBlur={handleSynonymChange}
        placeholder="Add synonyms"
        value={localSynonyms}
        onChangeText={setLocalSynonyms}
        onEnterPress={() => synonymsInputRef.current?.blur()}
      />
    </Container>
  );
};

export default InputItem;

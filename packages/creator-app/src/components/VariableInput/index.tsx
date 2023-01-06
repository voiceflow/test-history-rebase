import { Utils } from '@voiceflow/common';
import { useEnableDisable } from '@voiceflow/ui';
import React from 'react';

import { withEnterPress, withInputBlur } from '@/utils/dom';

import { Container, EditableTextInput, Label } from './components';

export interface VariableInputProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: VoidFunction;
  disabled?: boolean;
}

const VariableInput: React.OldFC<VariableInputProps> = ({ name, value, disabled, onChange }) => {
  const [inputValue, setInputValue] = React.useState(value);
  const editableTextRef = React.useRef<HTMLInputElement | null>(null);
  const [isFocused, enableFocus, disableFocus] = useEnableDisable();

  const onClick: React.MouseEventHandler<HTMLDivElement> = () => {
    if (isFocused) {
      return;
    }
    editableTextRef.current?.focus();
    enableFocus();
  };

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <Container
      isFocused={isFocused}
      disabled={!!disabled}
      onClick={onClick}
      onMouseDown={(e) => isFocused && e.target !== editableTextRef.current && e.preventDefault()}
      style={{ cursor: 'text' }}
    >
      <Label>{name}</Label>
      <EditableTextInput
        ref={editableTextRef}
        value={inputValue}
        name={name}
        disabled={disabled}
        onChangeText={setInputValue}
        onFocus={enableFocus}
        placeholder="Enter a value"
        onBlur={Utils.functional.chainVoid(disableFocus, () => {
          onChange(inputValue);
        })}
        onKeyPress={withEnterPress(withInputBlur())}
      />
    </Container>
  );
};

export default VariableInput;

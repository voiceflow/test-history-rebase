import { Utils } from '@voiceflow/common';
import { useEnableDisable, useLinkedState } from '@voiceflow/ui';
import React from 'react';

import { withEnterPress, withInputBlur } from '@/utils/dom';

import { Container, EditableTextInput, Label } from './components';

export interface VariableInputProps {
  name: string;
  value: string;
  onBlur?: (value: string) => void;
  onChange: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

const VariableInput: React.FC<VariableInputProps> = ({ name, value, disabled, onChange, onBlur, autoFocus }) => {
  const editableTextRef = React.useRef<HTMLInputElement | null>(null);
  const [isFocused, enableFocus, disableFocus] = useEnableDisable();

  const onClick: React.MouseEventHandler<HTMLDivElement> = () => {
    if (isFocused) {
      return;
    }
    editableTextRef.current?.focus();
    enableFocus();
  };

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
        value={value}
        name={name}
        disabled={disabled}
        onChangeText={(text: string) => onChange(text)}
        onFocus={enableFocus}
        autoFocus={autoFocus}
        placeholder="Enter a value"
        onBlur={Utils.functional.chainVoid(disableFocus, () => onBlur?.(value))}
        onKeyPress={withEnterPress(withInputBlur())}
      />
    </Container>
  );
};

export const ControlledVariableInput: React.FC<Omit<VariableInputProps, 'onChange'>> = ({ value, ...props }) => {
  const [state, setState] = useLinkedState(value);

  return <VariableInput value={state} {...props} onChange={setState} />;
};

export default VariableInput;

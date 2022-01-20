import { Utils } from '@voiceflow/common';
import { useEnableDisable } from '@voiceflow/ui';
import React from 'react';

import { EditableTextAPI } from '@/components/EditableText';
import { withEnterPress, withInputBlur } from '@/utils/dom';

import { Container, EditableTextInput, Label } from './components';

export interface VariableInputProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: VoidFunction;
}

const VariableInput: React.FC<VariableInputProps> = ({ name, value, onChange }) => {
  const [inputValue, setInputValue] = React.useState(value);
  const editableTextRef = React.useRef<EditableTextAPI>(null);
  const [isFocused, enableFocus, disableFocus] = useEnableDisable();

  const onClick: React.MouseEventHandler<HTMLDivElement> = () => {
    if (isFocused) {
      return;
    }
    enableFocus();
    editableTextRef.current?.startEditing();
  };

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <Container
      isFocused={isFocused}
      onClick={onClick}
      onMouseDown={(e) => isFocused && e.target !== editableTextRef.current?.inputRef.current && e.preventDefault()}
    >
      <Label>{name}</Label>
      <EditableTextInput
        ref={editableTextRef}
        value={inputValue}
        name={name}
        onChange={setInputValue}
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

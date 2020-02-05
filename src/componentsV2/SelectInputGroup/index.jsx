import React from 'react';

import Input from '@/componentsV2/Input';
import Select from '@/componentsV2/Select';
import VariablesInput from '@/componentsV2/VariablesInput';

import { Container, InputWrapper } from './components';

export const OrientationType = {
  LEFT: 'left',
  RIGHT: 'right',
};

function SelectInputGroup({ inputValue, orientation = OrientationType.RIGHT, placeholder, regularInput, onInputBlur, ...props }) {
  const [text, setText] = React.useState(inputValue);
  const inputRef = React.useRef();

  const onClick = React.useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const onBlurVariables = React.useCallback(
    ({ text }) => {
      onInputBlur?.(text);
    },
    [onInputBlur]
  );

  React.useEffect(() => {
    setText(inputValue);
  }, [inputValue]);

  const input = regularInput ? (
    <InputWrapper>
      <Input
        ref={inputRef}
        value={text}
        onBlur={() => onInputBlur?.(text)}
        variant="inline"
        onChange={({ target }) => setText(target.value)}
        placeholder={placeholder}
      />
    </InputWrapper>
  ) : (
    <InputWrapper>
      <VariablesInput ref={inputRef} variant="inline" value={text} onBlur={onBlurVariables} placeholder={placeholder} />
    </InputWrapper>
  );

  return (
    <Container regularInput={regularInput} onClick={onClick}>
      {orientation === OrientationType.LEFT && input}
      <Select {...props} inline minWidth={false} borderLess />
      {orientation === OrientationType.RIGHT && input}
    </Container>
  );
}

export default SelectInputGroup;

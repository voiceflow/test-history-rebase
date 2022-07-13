import { BaseSelectProps, Input, setRef, useLinkedState } from '@voiceflow/ui';
import React from 'react';

import VariablesInput from '@/components/VariablesInput';

import { Container, InputWrapper } from './components';

export enum OrientationType {
  LEFT = 'left',
  RIGHT = 'right',
}

export interface SelectInputGroupProps {
  value?: string;
  onBlur?: (value: string) => void;
  children: (props: BaseSelectProps) => React.ReactNode;
  multiline?: boolean;
  placeholder?: string;
  orientation?: OrientationType;
  variablesInput?: boolean;
  showDropdownColorOnActive?: boolean;
}

const SelectInputGroup: React.FC<SelectInputGroupProps> = ({
  value,
  onBlur,
  children,
  multiline = false,
  orientation = OrientationType.RIGHT,
  placeholder,
  variablesInput = true,
}) => {
  const inputRef = React.useRef<{ focus: VoidFunction }>(null);

  const [text, setText] = useLinkedState(value ?? '');

  const input = (
    <InputWrapper>
      {variablesInput ? (
        <VariablesInput
          ref={(ref) => setRef(inputRef, ref)}
          value={text}
          onBlur={({ text }) => onBlur?.(text)}
          variant={Input.Variant.INLINE}
          multiline={multiline}
          placeholder={placeholder}
        />
      ) : (
        <Input
          ref={(ref) => setRef(inputRef, ref)}
          value={text}
          onBlur={() => onBlur?.(text)}
          variant={Input.Variant.INLINE}
          placeholder={placeholder}
          onChangeText={setText}
        />
      )}
    </InputWrapper>
  );

  return (
    <Container variablesInput={variablesInput} onClick={() => inputRef.current?.focus()} multiline={multiline}>
      {orientation === OrientationType.LEFT && input}

      {children({
        inline: true,
        minWidth: false,
        borderLess: true,
        showDropdownColorOnActive: false,
      })}

      {orientation === OrientationType.RIGHT && input}
    </Container>
  );
};

export default SelectInputGroup;

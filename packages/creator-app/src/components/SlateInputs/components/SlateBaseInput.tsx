import composeRef from '@seznam/compose-react-refs';
import { Nullish } from '@voiceflow/common';
import { Input } from '@voiceflow/ui';
import React from 'react';

import SlateEditable, { SlateEditableProps, SlateEditableRef, SlateValue } from '@/components/SlateEditable';
import { ClassName } from '@/styles/constants';

export interface SlateBaseInputProps extends Omit<SlateEditableProps, 'onBlur'> {
  onBlur?: Nullish<(value: SlateValue, event: React.FocusEvent) => void>;
}

const SlateBaseInput: React.ForwardRefRenderFunction<SlateEditableRef, SlateBaseInputProps> = ({ value, onBlur, children, ...props }, ref) => (
  <Input className={ClassName.TEXT_EDITOR}>
    {({ ref: inputRef }) => (
      <SlateEditable ref={composeRef(inputRef, ref)} value={value} onBlur={(event) => onBlur?.(value, event)} {...props}>
        {children}
      </SlateEditable>
    )}
  </Input>
);

export default React.forwardRef<SlateEditableRef, SlateBaseInputProps>(SlateBaseInput);

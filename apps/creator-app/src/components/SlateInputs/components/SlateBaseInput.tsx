import composeRef from '@seznam/compose-react-refs';
import type { Nullish } from '@voiceflow/common';
import { Input } from '@voiceflow/ui';
import React from 'react';

import type { SlateEditableProps, SlateEditableRef, SlateValue } from '@/components/SlateEditable';
import SlateEditable from '@/components/SlateEditable';
import { ClassName } from '@/styles/constants';

export interface SlateBaseInputProps extends Omit<SlateEditableProps, 'onBlur'> {
  onBlur?: Nullish<(value: SlateValue, event: React.FocusEvent<HTMLDivElement>) => void>;
  isActive?: boolean;
}

const SlateBaseInput: React.ForwardRefRenderFunction<SlateEditableRef, SlateBaseInputProps> = (
  { value, onBlur, children, isActive, ...props },
  ref
) => (
  <Input isActive={isActive} className={ClassName.TEXT_EDITOR}>
    {({ ref: inputRef }) => (
      <SlateEditable
        ref={composeRef(ref, inputRef as any)}
        value={value}
        onBlur={(event) => onBlur?.(value, event)}
        {...props}
      >
        {children}
      </SlateEditable>
    )}
  </Input>
);

export default React.forwardRef<SlateEditableRef, SlateBaseInputProps>(SlateBaseInput);

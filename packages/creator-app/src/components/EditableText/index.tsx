import { Utils } from '@voiceflow/common';
import { useDidUpdateEffect, useEnableDisable } from '@voiceflow/ui';
import React from 'react';
import { AutosizeInputProps } from 'react-input-autosize';
import { Assign } from 'utility-types';

import { withTargetValue } from '@/utils/dom';

import { UnstyledInput, UnstyledText } from './components';

export type EditableTextProps = Assign<
  Omit<AutosizeInputProps, 'ref'>,
  {
    id?: string;
    value: string;
    onBlur?: VoidFunction;
    onFocus?: VoidFunction;
    onChange: (value: string) => void;
    className?: string;
  }
>;

export interface EditableTextAPI {
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  titleRef: React.MutableRefObject<HTMLSpanElement | null>;
  stopEditing: VoidFunction;
  startEditing: VoidFunction;
}

const EditableText = React.forwardRef<EditableTextAPI, EditableTextProps>(({ id, value, onChange, onBlur, onFocus, className, ...props }, ref) => {
  const [isEditing, startEditing, stopEditing] = useEnableDisable();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const titleRef = React.useRef<HTMLSpanElement | null>(null);

  const onInputRef = (node: HTMLInputElement | null) => {
    inputRef.current = node;
  };

  const api = React.useMemo(
    () => ({
      inputRef,
      titleRef,
      stopEditing,
      startEditing,
    }),
    []
  );

  React.useImperativeHandle(ref, () => api, [api]);

  useDidUpdateEffect(() => {
    if (isEditing) {
      inputRef.current?.select();
    }
  }, [isEditing]);

  return isEditing ? (
    <UnstyledInput
      id={id}
      value={value}
      onBlur={Utils.functional.chainVoid(stopEditing, onBlur)}
      inputRef={onInputRef}
      onChange={withTargetValue(onChange)}
      className={className}
      {...props}
    />
  ) : (
    <UnstyledText
      id={id}
      ref={titleRef}
      onFocus={props.readOnly ? undefined : Utils.functional.chainVoid(startEditing, onFocus)}
      tabIndex={-1}
      className={className}
    >
      {value}
    </UnstyledText>
  );
});

export default EditableText;

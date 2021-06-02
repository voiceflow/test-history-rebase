import React from 'react';
import { AutosizeInputProps } from 'react-input-autosize';
import { Assign } from 'utility-types';

import { useDidUpdateEffect, useEnableDisable } from '@/hooks';

import { UnstyledInput, UnstyledText } from './components';

export type EditableTextProps = Assign<
  Omit<AutosizeInputProps, 'ref'>,
  {
    className?: string;
    id?: string;
    value: string;
    onChange: (value: string) => void;
    onBlur?: VoidFunction;
    onFocus?: VoidFunction;
  }
>;

export type EditableTextAPI = {
  stopEditing: VoidFunction;
  startEditing: VoidFunction;
};

// eslint-disable-next-line react/display-name
const EditableText = React.forwardRef<EditableTextAPI, EditableTextProps>(({ value, onChange, onBlur, onFocus, id, className, ...props }, ref) => {
  const [isEditing, startEditing, stopEditing] = useEnableDisable();
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const api = React.useMemo(() => ({ startEditing, stopEditing }), []);

  React.useImperativeHandle(ref, () => api, [api]);

  useDidUpdateEffect(() => {
    if (isEditing) {
      inputRef.current?.select();
    }
  }, [isEditing]);

  return isEditing ? (
    <UnstyledInput
      value={value}
      inputRef={(node) => {
        inputRef.current = node;
      }}
      onChange={(event) => onChange(event.target.value)}
      onBlur={() => {
        stopEditing();
        onBlur?.();
      }}
      id={id}
      className={className}
      {...props}
    />
  ) : (
    <UnstyledText
      tabIndex={-1}
      onFocus={() => {
        if (props.readOnly) return;

        startEditing();
        onFocus?.();
      }}
      id={id}
      className={className}
    >
      {value}
    </UnstyledText>
  );
});

export default EditableText;

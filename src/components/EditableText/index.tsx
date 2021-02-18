import React from 'react';
import { AutosizeInputProps } from 'react-input-autosize';
import { Assign } from 'utility-types';

import { useEnableDisable } from '@/hooks';

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
  startEditing: VoidFunction;
};

// eslint-disable-next-line react/display-name
const EditableText = React.forwardRef<EditableTextAPI, EditableTextProps>(({ value, onChange, onBlur, onFocus, id, className, ...props }, ref) => {
  const [isEditing, startEditing, stopEditing] = useEnableDisable();

  const api = React.useMemo(() => ({ startEditing }), []);

  React.useImperativeHandle(ref, () => api, [api]);

  return isEditing ? (
    <UnstyledInput
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onFocus={(event) => event.target.select()}
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

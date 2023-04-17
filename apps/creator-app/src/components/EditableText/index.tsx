import composeRef from '@seznam/compose-react-refs';
import { Utils } from '@voiceflow/common';
import { useDidUpdateEffect, useEnableDisable, withEnterPress, withInputBlur } from '@voiceflow/ui';
import React from 'react';
import { AutosizeInputProps } from 'react-input-autosize';

import { withTargetValue } from '@/utils/dom';

import { UnstyledInput, UnstyledText } from './components';

export interface EditableTextProps extends Omit<AutosizeInputProps, 'ref' | 'onChange' | 'onBlur' | 'onFocus'> {
  id?: string;
  value: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLSpanElement>;
  editing?: boolean;
  onChange: (value: string) => void;
  titleRef?: React.RefObject<HTMLElement>;
  className?: string;
  placeholder?: string;
  startEditingOnFocus?: boolean;
}

export interface EditableTextAPI {
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  titleRef: React.MutableRefObject<HTMLSpanElement | null>;
  stopEditing: VoidFunction;
  startEditing: VoidFunction;
}

const EditableText = React.forwardRef<EditableTextAPI, EditableTextProps>(
  (
    { id, value, onChange, editing, onBlur, onFocus, children, titleRef: titleRefProp, className, placeholder, startEditingOnFocus = true, ...props },
    ref
  ) => {
    const [isEditing, startEditing, stopEditing] = useEnableDisable(editing);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const titleRef = React.useRef<HTMLSpanElement | null>(null);

    const onInputRef = (node: HTMLInputElement | null) => {
      inputRef.current = node;
    };

    const api = React.useMemo(() => ({ inputRef, titleRef, stopEditing, startEditing }), []);

    React.useImperativeHandle(ref, () => api, [api]);

    useDidUpdateEffect(() => {
      if (editing) {
        startEditing();
      } else {
        inputRef.current?.blur();
      }
    }, [editing]);

    useDidUpdateEffect(() => {
      if (isEditing) {
        inputRef.current?.select();
      } else {
        titleRef.current?.parentElement?.scrollTo({ left: 0 });
      }
    }, [isEditing]);

    return isEditing ? (
      <UnstyledInput
        id={id}
        value={value}
        onBlur={Utils.functional.chain(onBlur, stopEditing)}
        inputRef={onInputRef}
        onChange={withTargetValue(onChange)}
        className={className}
        onKeyPress={withEnterPress(withInputBlur())}
        placeholder={placeholder}
        {...props}
      />
    ) : (
      <UnstyledText
        id={id}
        ref={composeRef(titleRef, titleRefProp)}
        onFocus={props.readOnly || !startEditingOnFocus ? undefined : Utils.functional.chain(onFocus, startEditing)}
        onClick={props.onClick}
        tabIndex={-1}
        className={className}
        isPlaceholder={!!placeholder && !value}
      >
        {children || value || placeholder}
      </UnstyledText>
    );
  }
);

export default EditableText;

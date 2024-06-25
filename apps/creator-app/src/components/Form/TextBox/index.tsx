import React from 'react';
import type { Assign } from 'utility-types';

import InputError from '@/components/Form/TextInput/components/InputError';

import type { WrappedFormControlProps } from '../types';
import type { TextBoxInputProps } from './components/TextBoxInput';
import TextBoxInput from './components/TextBoxInput';

type TextBoxProps = Assign<Omit<TextBoxInputProps, 'as'>, WrappedFormControlProps>;

const TextBox: React.FC<TextBoxProps> = ({ value, onChange, touched, ...props }) => (
  <>
    <TextBoxInput errorBound={touched && props.error} onChange={onChange} value={value} {...props} />
    {touched &&
      ((props.error && <InputError>{props.error}</InputError>) || (props.warning && <span>{props.warning}</span>))}
  </>
);

export default TextBox;

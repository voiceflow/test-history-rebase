import React from 'react';
import { Assign } from 'utility-types';

import InputError from '@/components/Form/TextInput/components/InputError';

import { WrappedFormControlProps } from '../types';
import TextBoxInput, { TextBoxInputProps } from './components/TextBoxInput';

type TextBoxProps = Assign<Omit<TextBoxInputProps, 'as'>, WrappedFormControlProps>;

const TextBox: React.FC<TextBoxProps> = ({ value, onChange, touched, ...props }) => (
  <>
    <TextBoxInput errorBound={touched && props.error} onChange={onChange} value={value} {...props} />
    {touched && ((props.error && <InputError>{props.error}</InputError>) || (props.warning && <span>{props.warning}</span>))}
  </>
);

export default TextBox;

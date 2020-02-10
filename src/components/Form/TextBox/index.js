import React from 'react';

import InputError from '@/components/Form/TextInput/components/InputError';

import bindControl from '../bindControl';
import TextBoxInput from './components/TextBoxInput';

const TextBox = ({ value, onChange, ...props }) => {
  return (
    <>
      <TextBoxInput errorBound={props.touched && props.error} onChange={onChange} value={value} {...props} touched="false" />
      {props.touched && ((props.error && <InputError>{props.error}</InputError>) || (props.warning && <span>{props.warning}</span>))}
    </>
  );
};

export default TextBox;

export const FormTextBox = bindControl(TextBox);

import React from 'react';

import bindControl from '../bindControl';
import InputComponent from './components/InputComponent';
import InputError from './components/InputError';

const Input = ({ value, onChange, ...props }) => {
  return (
    <>
      <InputComponent errorBound={props.touched && props.error} onChange={onChange} value={value} {...props} />
      {props.touched && ((props.error && <InputError>{props.error}</InputError>) || (props.warning && <span>{props.warning}</span>))}
    </>
  );
};

export default Input;

export const FormTextInput = bindControl(Input);

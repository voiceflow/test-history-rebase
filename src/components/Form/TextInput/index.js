import React from 'react';

import bindControl from '../bindControl';
import InputComponent from './components/InputComponent';
import InputError from './components/InputError';

const Input = ({ value, onChange, onBlur, ...props }) => {
  return (
    <>
      <InputComponent errorBound={props.touched && props.error} onBlur={onBlur} onChange={onChange} value={value} {...props} />
      {props.touched && ((props.error && <InputError>{props.error}</InputError>) || (props.warning && <span>{props.warning}</span>))}
    </>
  );
};

export default Input;

export const FormTextInput = bindControl(Input);

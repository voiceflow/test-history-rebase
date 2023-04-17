import React from 'react';
import { Assign } from 'utility-types';

import { WrappedFormControlProps } from '../types';
import InputComponent, { InputComponentProps } from './components/InputComponent';
import InputError from './components/InputError';

export type InputProps = Assign<Omit<InputComponentProps, 'ref'>, WrappedFormControlProps>;

const Input: React.FC<InputProps> = ({ value, onChange, onBlur, ...props }) => (
  <>
    <InputComponent errorBound={props.touched && props.error} onBlur={onBlur} onChange={onChange} value={value} {...props} />
    {props.touched && ((props.error && <InputError>{props.error}</InputError>) || (props.warning && <span>{props.warning}</span>))}
  </>
);

export default Input;

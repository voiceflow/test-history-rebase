import React from 'react';

import { styled } from '@/hocs';
import { FadeLeftContainer } from '@/styles/animations';

import { NestedInput, NestedInputProps } from './DefaultInput';

const getColor = (error?: boolean, complete?: boolean) => {
  if (error) {
    return '#E91E63';
  }

  if (complete) {
    return '#279745';
  }

  return undefined;
};

const getIcon = (error?: boolean, complete?: boolean) => {
  if (error) {
    return 'error';
  }

  if (complete) {
    return 'check2';
  }

  return 'error';
};

const Message = styled(FadeLeftContainer)`
  text-transform: capitalize;
  color: #8da2b5;
  font-size: 13px;
`;

export type ControlledInputProps = NestedInputProps & {
  complete?: boolean;
  message?: React.ReactNode;
};

const ControlledInput: React.FC<ControlledInputProps> = ({ error, complete, message, ...props }) => (
  <NestedInput
    {...props}
    icon={getIcon(error, complete)}
    error={error}
    iconProps={{ color: getColor(error, complete) || '#d4d9e6' }}
    rightAction={message && <Message distance={8}>{message}</Message>}
    wrapperProps={{ borderColor: getColor(error, complete) }}
  />
);

export default ControlledInput;

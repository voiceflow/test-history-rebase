import React from 'react';

import { styled } from '@/hocs';
import { FadeLeftContainer } from '@/styles/animations/FadeLeft';

import { NestedInput } from './DefaultInput';

const getColor = (error, complete) => {
  if (error) {
    return '#E91E63';
  }

  if (complete) {
    return '#279745';
  }

  return undefined;
};

const getIcon = (error, complete) => {
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

function ControlledInput({ error, complete, message, ...props }) {
  return (
    <NestedInput
      {...props}
      icon={getIcon(error, complete)}
      error={error}
      iconProps={{ color: getColor(error, complete) || '#d4d9e6' }}
      rightAction={message && <Message distance={8}>{message}</Message>}
      wrapperProps={{ borderColor: getColor(error, complete) }}
    />
  );
}

export default ControlledInput;

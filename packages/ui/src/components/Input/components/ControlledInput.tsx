import React from 'react';

import { colors, styled, ThemeColor } from '../../../styles';
import { FadeLeftContainer } from '../../../styles/animations';
import { COLOR_GREEN, COLOR_RED } from '../../../styles/constants';
import { NestedInput, NestedInputProps } from './DefaultInput';

const getColor = (error?: boolean, complete?: boolean) => {
  if (error) {
    return COLOR_RED;
  }

  if (complete) {
    return COLOR_GREEN;
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
  color: ${colors(ThemeColor.TERTIARY)};
  font-size: 13px;
  text-transform: capitalize;
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

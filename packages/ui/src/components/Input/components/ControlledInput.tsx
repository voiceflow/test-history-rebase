import { colors, styled, ThemeColor } from '@ui/styles';
import { FadeLeftContainer } from '@ui/styles/animations';
import { COLOR_GREEN, COLOR_RED } from '@ui/styles/constants';
import React from 'react';

import { NestedInput, NestedInputProps } from './DefaultInput';

const Message = styled(FadeLeftContainer)`
  color: ${colors(ThemeColor.TERTIARY)};
  font-size: 13px;
  text-transform: capitalize;
`;

const getColor = (error?: boolean, complete?: boolean) => {
  if (error) return COLOR_RED;
  if (complete) return COLOR_GREEN;

  return undefined;
};

const getIcon = (error?: boolean, complete?: boolean) => {
  if (error) return 'error';
  if (complete) return 'check2';

  return 'error';
};

export interface ControlledInputProps extends NestedInputProps {
  message?: React.ReactNode;
  complete?: boolean;
}

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

import { Utils } from '@voiceflow/common';
import React from 'react';

import { colors, styled, ThemeColor } from '@/styles';
import { FadeLeft } from '@/styles/animations';
import { COLOR_GREEN, COLOR_RED } from '@/styles/constants';
import { withEnterPress, withTargetValue } from '@/utils/dom';

import type { NestedInputProps } from './DefaultInput';
import { NestedInput } from './DefaultInput';

const Message = styled(FadeLeft)`
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
  onChangeText?: (value: string) => void;
  onEnterPress?: React.KeyboardEventHandler<HTMLInputElement>;
}

const ControlledInput: React.FC<ControlledInputProps> = ({
  error,
  message,
  complete,
  onChange,
  onKeyPress,
  onChangeText,
  onEnterPress,
  ...props
}) => (
  <NestedInput
    {...props}
    icon={getIcon(error, complete)}
    error={error}
    onChange={Utils.functional.chain(onChange, onChangeText && withTargetValue(onChangeText))}
    iconProps={{ color: getColor(error, complete) || '#d4d9e6' }}
    onKeyPress={Utils.functional.chain(onKeyPress, onEnterPress && withEnterPress(onEnterPress))}
    rightAction={message && <Message distance={8}>{message}</Message>}
    wrapperProps={{ borderColor: getColor(error, complete) }}
  />
);

export default ControlledInput;

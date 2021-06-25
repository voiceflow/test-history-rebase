import React from 'react';

import { css, styled } from '../../../styles';
import { ButtonVariant } from '../constants';
import BaseButton, { BaseButtonProps } from './BaseButton';

export const BUTTON_HEIGHT = 42;

export interface ButtonContainerProps extends BaseButtonProps, React.ButtonHTMLAttributes<HTMLButtonElement> {
  square?: boolean;
  nowrap?: boolean;
  variant?: ButtonVariant;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const buttonContainerStyles = css<ButtonContainerProps>`
  height: ${BUTTON_HEIGHT}px;
  border-radius: 90px;
  font-size: 15px;
  line-height: 18px;

  width: ${({ fullWidth, square }) => {
    if (square) {
      return `${BUTTON_HEIGHT}px`;
    }

    if (fullWidth) {
      return '100%';
    }

    return 'auto';
  }};

  ${({ nowrap }) =>
    nowrap &&
    css`
      white-space: nowrap;
    `}
`;

const ButtonContainer = styled(BaseButton)<ButtonContainerProps>`
  ${buttonContainerStyles}
`;

export default ButtonContainer;

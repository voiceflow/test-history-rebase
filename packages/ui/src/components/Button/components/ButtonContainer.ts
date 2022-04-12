import { ButtonVariant } from '@ui/components/Button/constants';
import { css, styled } from '@ui/styles';
import React from 'react';

import BaseButton, { BaseButtonProps } from './BaseButton';

export const BUTTON_HEIGHT = 42;

export interface ButtonContainerProps extends BaseButtonProps, React.ButtonHTMLAttributes<HTMLButtonElement> {
  square?: boolean;
  nowrap?: boolean;
  variant?: ButtonVariant;
  isLoading?: boolean;
  fullWidth?: boolean;
  minWidth?: number;
  squareRadius?: boolean;
}

export const buttonContainerStyles = css<ButtonContainerProps>`
  height: ${BUTTON_HEIGHT}px;
  border-radius: 90px;
  font-size: 15px;
  line-height: 18px;

  ${({ minWidth }) =>
    minWidth &&
    css`
      min-width: ${minWidth}px;
    `}

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

  ${({ squareRadius }) =>
    squareRadius &&
    css`
      border-radius: 10px !important;
    `}
`;

const ButtonContainer = styled(BaseButton)<ButtonContainerProps>`
  ${buttonContainerStyles}
`;

export default ButtonContainer;

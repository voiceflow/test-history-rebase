import { css, styled } from '@ui/styles';
import type React from 'react';

import type { BaseButtonProps } from './BaseButton';
import BaseButton from './BaseButton';

export const BUTTON_HEIGHT = 42;

export interface ButtonContainerProps extends BaseButtonProps, React.ButtonHTMLAttributes<HTMLButtonElement> {
  width?: number;
  square?: boolean;
  nowrap?: boolean;
  inline?: boolean;
  minWidth?: number;
  isLoading?: boolean;
  fullWidth?: boolean;
  squareRadius?: boolean;
}

export const buttonContainerStyles = css<ButtonContainerProps>`
  height: ${BUTTON_HEIGHT}px;
  border-radius: 90px;
  font-size: 15px;
  line-height: 18px;

  ${({ inline }) =>
    inline &&
    css`
      display: inline-block;
    `}

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

  ${({ width }) =>
    width &&
    css`
      width: ${width}px;
    `}

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

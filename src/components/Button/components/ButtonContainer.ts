import { css, styled } from '@/hocs';

import { BUTTON_HEIGHT } from '../styles';
import BaseButton, { BaseButtonProps } from './BaseButton';

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
`;

export type ButtonContainerProps = BaseButtonProps & {
  fullWidth?: boolean;
  square?: boolean;
};

const ButtonContainer = styled(BaseButton)<ButtonContainerProps>`
  ${buttonContainerStyles}
`;

export default ButtonContainer;

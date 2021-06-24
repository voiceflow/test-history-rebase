import { css, styled } from '../../../styles';
import { BUTTON_HEIGHT } from '../styles';
import BaseButton, { BaseButtonProps } from './BaseButton';

export const buttonContainerStyles = css<ButtonContainerProps>`
  height: ${BUTTON_HEIGHT}px;
  font-size: 15px;
  line-height: 18px;
  border-radius: 90px;

  ${({ fullWidth, square }) => {
    if (square) {
      return css`
        width: ${BUTTON_HEIGHT}px;
      `;
    }
    if (fullWidth) {
      return css`
        width: 100%;
      `;
    }
    return css`
      width: auto;
    `;
  }};

  ${({ nowrap }) => nowrap && 'white-space: nowrap;'}
`;

export type ButtonContainerProps = BaseButtonProps & {
  fullWidth?: boolean;
  square?: boolean;
  nowrap?: boolean;
};

const ButtonContainer = styled(BaseButton)<ButtonContainerProps>`
  ${buttonContainerStyles}
`;

export default ButtonContainer;

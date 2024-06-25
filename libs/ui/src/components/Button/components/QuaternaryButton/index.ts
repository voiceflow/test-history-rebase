import type { ButtonVariant } from '@ui/components/Button/constants';
import { colors, css, styled, ThemeColor, transition } from '@ui/styles';

import type { ButtonContainerProps } from '../ButtonContainer';
import ButtonContainer from '../ButtonContainer';
import type { CommonButtonProps } from '../types';

export type QuaternaryButtonProps = ButtonContainerProps & CommonButtonProps<ButtonVariant.QUATERNARY>;

const QuaternaryButton = styled(ButtonContainer)<QuaternaryButtonProps>`
  ${transition('background-color', 'opacity')}
  position: relative;
  z-index: 1;
  display: inline-block;
  padding: 9px 22px 10px;
  color: ${colors(ThemeColor.DARKER_BLUE)};
  font-weight: 600;
  background-color: rgba(93, 157, 245, 0.1);
  border: 0;
  border-radius: 41px;
  box-shadow: none;

  &:hover {
    background-color: rgba(93, 157, 245, 0.15);
  }

  &:active {
    background-color: rgba(93, 157, 245, 0.2);
  }

  ${({ disabled }) =>
    disabled &&
    css`
      background: transparent !important;
      opacity: 0.5;
    `}
`;

export default QuaternaryButton;

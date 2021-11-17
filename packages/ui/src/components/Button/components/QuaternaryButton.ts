import { ButtonVariant } from '@ui/components/Button/constants';
import { colors, css, styled, ThemeColor, transition } from '@ui/styles';

import ButtonContainer, { ButtonContainerProps } from './ButtonContainer';

export interface QuaternaryButtonProps extends ButtonContainerProps {
  variant: ButtonVariant.QUATERNARY;
}

const QuaternaryButton = styled(ButtonContainer)<QuaternaryButtonProps>`
  ${transition('background-color', 'opacity')}
  position: relative;
  z-index: 1;
  display: inline-block;
  padding: 8px 22px 10px;
  color: ${colors(ThemeColor.BLUE)};
  font-weight: 600;
  background-color: ${colors(ThemeColor.WHITE)};
  background-image: linear-gradient(-180deg, #5d9df515 0%, #5d9df520 78%);
  border: 0;
  border-radius: 41px;
  box-shadow: none;

  &:hover {
    background-color: #5d9df510;
  }

  &:active {
    background-color: #5d9df520;
  }

  ${({ disabled }) =>
    disabled &&
    css`
      background: transparent !important;
      opacity: 0.5;
    `}
`;

export default QuaternaryButton;

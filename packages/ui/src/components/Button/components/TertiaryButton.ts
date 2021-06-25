import { css, styled, transition } from '../../../styles';
import { ButtonVariant } from '../constants';
import ButtonContainer, { ButtonContainerProps } from './ButtonContainer';

export interface TertiaryButtonProps extends ButtonContainerProps {
  variant: ButtonVariant.TERTIARY;
}

const TertiaryButton = styled(ButtonContainer)<TertiaryButtonProps>`
  ${transition('background', 'background-color')}
  padding: 0 22px;
  color: #5d9df5;
  font-weight: 600;
  border: 0;
  box-shadow: none;

  ${({ disabled }) =>
    disabled
      ? css`
          color: rgba(93, 157, 245, 0.5);
          pointer-events: none;
        `
      : css`
          &:hover {
            background: rgba(93, 157, 245, 0.1);
          }
        `}

  &:active {
    background: rgba(93, 157, 245, 0.16);
  }
`;

export default TertiaryButton;

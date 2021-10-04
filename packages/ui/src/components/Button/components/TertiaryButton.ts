import { colors, css, styled, ThemeColor, transition } from '../../../styles';
import { ButtonVariant } from '../constants';
import ButtonContainer, { ButtonContainerProps } from './ButtonContainer';

export interface TertiaryButtonProps extends ButtonContainerProps {
  variant: ButtonVariant.TERTIARY;
  isGray?: boolean;
}

const TertiaryButton = styled(ButtonContainer)<TertiaryButtonProps>`
  ${transition('background', 'background-color')}
  padding: 0 22px;
  color: ${({ isGray }) => (isGray ? colors(ThemeColor.TERTIARY) : colors(ThemeColor.BLUE))};
  font-weight: 600;
  border: 0;
  box-shadow: none;

  ${({ disabled, isGray }) =>
    disabled
      ? css`
          color: ${isGray ? 'rgb(141, 162, 181, 0.5)' : 'rgba(93, 157, 245, 0.5)'};
          pointer-events: none;
        `
      : css`
          &:hover {
            background: ${isGray ? 'rgb(141, 162, 181, 0.09)' : 'rgba(93, 157, 245, 0.1)'};
          }
        `}

  &:active {
    background: ${({ isGray }) => (isGray ? 'rgb(141, 162, 181, 0.15)' : 'rgba(93, 157, 245, 0.16)')};
  }
`;

export default TertiaryButton;

import type { ButtonVariant } from '@/components/Button/constants';
import { colors, css, styled, ThemeColor, transition } from '@/styles';

import type { ButtonContainerProps } from '../ButtonContainer';
import ButtonContainer from '../ButtonContainer';
import type { CommonButtonProps } from '../types';

export type TertiaryButtonProps = ButtonContainerProps &
  CommonButtonProps<
    ButtonVariant.TERTIARY,
    {
      isGray?: boolean;
    }
  >;

const TertiaryButton = styled(ButtonContainer)<TertiaryButtonProps>`
  ${transition('background', 'background-color')}
  padding: 0px 20px;
  color: ${({ isGray }) => (isGray ? colors(ThemeColor.TERTIARY) : '#3d82e2')};
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
            background-color: ${isGray ? 'rgb(141, 162, 181, 0.09)' : 'rgba(60, 129, 226, 0.1)'};
          }
        `}

  &:active {
    background-color: ${({ isGray }) => (isGray ? 'rgb(141, 162, 181, 0.15)' : 'rgba(60, 129, 226, 0.16)')};
  }
`;

export default TertiaryButton;

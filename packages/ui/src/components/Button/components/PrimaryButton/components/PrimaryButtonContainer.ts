import ButtonContainer, { ButtonContainerProps } from '@ui/components/Button/components/ButtonContainer';
import { colors, css, styled, ThemeColor, transition } from '@ui/styles';

import Icon from './PrimaryButtonIcon';

export interface PrimaryButtonContainerProps extends ButtonContainerProps {
  canHover?: boolean;
}

const PrimaryButtonContainer = styled(ButtonContainer)<PrimaryButtonContainerProps>`
  ${transition('background', 'opacity', 'box-shadow')}
  color: ${colors(ThemeColor.WHITE)};
  font-weight: 600;
  white-space: nowrap;
  text-align: center;
  background-color: #3d82e2;
  background-size: 1px 52px;
  box-shadow: inset 0px -1px 0px 1px rgba(19, 33, 68, 0.08), 0px 1px 3px 0px rgba(19, 33, 68, 0.16), 0px 0px 1px 0px rgba(19, 33, 68, 0.08),
    0px 1px 1px 0px rgba(19, 33, 68, 0.1);

  ${({ disabled, canHover = true }) =>
    disabled
      ? css`
          box-shadow: none;
          opacity: 0.4;

          & ${Icon} {
            opacity: 0.46;
          }
        `
      : canHover &&
        css`
          &:hover {
            background-position: 0;
          }
        `}

  &:hover {
    background-color: #2f75d6;
  }
`;

export default PrimaryButtonContainer;

import ButtonContainer, { ButtonContainerProps } from '@ui/components/Button/components/ButtonContainer';
import { backgrounds, colors, css, styled, ThemeColor, transition } from '@ui/styles';

import Icon from './SecondaryButtonIcon';

export interface SecondaryButtonContainerProps extends ButtonContainerProps {
  flat?: boolean;
  isActive?: boolean;
}

const hoverStyles = css<SecondaryButtonContainerProps>`
  background-color: ${({ flat }) => (flat ? 'rgba(238, 244, 246, 1)' : '#e0ebee')};
  & ${Icon} {
    color: ${({ theme }) => theme.buttonIconColors.hover};
  }
`;

const SecondaryButtonContainer = styled(ButtonContainer)<SecondaryButtonContainerProps>`
  ${transition('background', 'opacity', 'box-shadow', 'background-color')}
  box-sizing: border-box;
  padding: 9px 22px 10px;
  color: ${colors(ThemeColor.PRIMARY)};
  font-weight: 600;
  line-height: 22px;
  background-color: #eef4f6d9;
  background-size: 1px 42px;
  border: 1px solid ${colors(ThemeColor.BORDERS)};

  ${({ square }) =>
    square &&
    css`
      padding: 9px 20px 10px;
    `}

  ${({ flat }) =>
    flat &&
    css`
      padding: 9px 18px 10px;
      background-color: rgba(238, 244, 246, 0.7);
      border-radius: 10px;
    `}

  ${({ disabled }) =>
    disabled
      ? css`
          color: rgba(19, 33, 68, 0.5);
          background: linear-gradient(-180deg, rgba(238, 244, 246, 0.3) 0%, ${backgrounds('greyGreen')} 100%);

          & ${Icon} {
            opacity: 0.5;
          }
        `
      : css`
          &:hover,
          &:active {
            ${hoverStyles}
          }
        `}

  ${({ isActive }) =>
    isActive &&
    css`
      ${hoverStyles}
    `}
`;

export default SecondaryButtonContainer;

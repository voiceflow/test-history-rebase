import ButtonContainer, { ButtonContainerProps } from '@ui/components/Button/components/ButtonContainer';
import { backgrounds, colors, css, styled, ThemeColor, transition } from '@ui/styles';

export interface SecondaryButtonIconProps {
  withoutChildren?: boolean;
}
export interface SecondaryButtonContainerProps extends ButtonContainerProps {
  flat?: boolean;
  noShadow?: boolean;
  isActive?: boolean;
  opaque?: boolean;
}

export const SecondaryButtonIcon = styled.span<SecondaryButtonIconProps>`
  ${transition('color')}
  width: 16px;
  height: 16px;
  color: ${({ theme }) => theme.buttonIconColors.default};
  ${({ withoutChildren }) =>
    !withoutChildren &&
    css`
      margin-right: 16px;
    `}
`;

const hoverActiveStyles = css`
  background-color: #e0ebee;
  & ${SecondaryButtonIcon} {
    color: ${({ theme }) => theme.buttonIconColors.hover};
  }
`;

const flatHoverStyles = css`
  background-color: #eff5f6;
  box-shadow: 0 0 0 1px rgba(204, 211, 228, 0.8);
  & ${SecondaryButtonIcon} {
    color: ${({ theme }) => theme.buttonIconColors.hover};
  }
`;

const flatActiveStyles = css`
  background-color: #e7f0f2;
  box-shadow: 0 0 0 1px rgba(204, 211, 228, 1);
  & ${SecondaryButtonIcon} {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const SecondaryButtonContainer = styled(ButtonContainer)<SecondaryButtonContainerProps>`
  ${transition('color', 'opacity', 'box-shadow', 'background-color')}
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
      padding: 11px 20px 10px;
      background-color: #f2f7f8;
      border-radius: 10px;
      box-shadow: 0 0 0 1px rgba(204, 211, 228, 0.6);
      border: 1px solid #fff;
    `}

  ${({ noShadow }) =>
    noShadow &&
    css`
      box-shadow: none !important;
    `}
  ${({ flat, disabled }) =>
    disabled
      ? css`
          color: rgba(19, 33, 68, 0.5);
          background: linear-gradient(-180deg, rgba(238, 244, 246, 0.3) 0%, ${backgrounds('greyGreen')} 100%);
          & ${SecondaryButtonIcon} {
            opacity: 0.5;
          }
        `
      : css`
          &:hover {
            ${flat ? flatHoverStyles : hoverActiveStyles}
          }
          &:active {
            ${flat ? flatActiveStyles : hoverActiveStyles}
          }
        `}
  ${({ flat, isActive }) =>
    isActive &&
    css`
      ${flat ? flatActiveStyles : hoverActiveStyles}
      &:hover {
        ${flat ? flatActiveStyles : hoverActiveStyles}
      }
    `}

  ${({ opaque }) =>
    opaque &&
    css`
      background-color: #ffffff;
    `}
`;

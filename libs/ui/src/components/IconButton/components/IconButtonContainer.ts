import { ButtonContainer } from '@ui/components/Button';
import { IconButtonVariant } from '@ui/components/IconButton/types';
import { colors, css, styled, ThemeColor, transition } from '@ui/styles';

export interface BaseContainerProps
  extends Pick<React.ComponentProps<'button'>, 'id' | 'className' | 'disabled' | 'onClick' | 'onMouseDown' | 'onMouseUp'> {
  variant?: IconButtonVariant;
}

export interface IconButtonContainerSharedProps extends BaseContainerProps {
  large?: boolean;
  active?: boolean;
}

export interface IconButtonContainerProps extends IconButtonContainerSharedProps {
  variant?: IconButtonVariant.NORMAL;
}

const SIZE = {
  small: 34,
  large: 42,
};

export const importantStyles = css`
  background: linear-gradient(180deg, rgba(93, 157, 245, 0.14) 0%, rgba(44, 133, 255, 0.205899) 97.03%), ${colors(ThemeColor.WHITE)};
`;

export const activeStyle = css`
  ${importantStyles}
  color: ${colors(ThemeColor.BLUE)};
  border: 1px solid ${colors(ThemeColor.WHITE)};
  box-shadow: 0 0 0 1px #5b9dfa99 !important;

  &:hover {
    color: ${colors(ThemeColor.BLUE)};
  }
`;

const IconButtonContainer = styled(ButtonContainer)<IconButtonContainerProps>`
  ${transition('box-shadow', 'color')}
  position: relative;
  z-index: 1;
  width: ${({ large }) => (large ? `${SIZE.large}px` : `${SIZE.small}px`)};
  height: ${({ large }) => (large ? `${SIZE.large}px` : `${SIZE.small}px`)};
  color: rgba(110, 132, 154, 0.75);
  background-color: ${colors(ThemeColor.WHITE)};
  background-size: cover;
  border: 1px solid transparent;
  box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.04), 0 2px 4px 0 rgba(17, 49, 96, 0.16);

  &:hover {
    color: rgba(110, 132, 154, 1);
  }

  &:active {
    ${activeStyle}
  }

  ${({ disabled }) =>
    disabled
      ? css`
          opacity: 0.5;
        `
      : css`
          &:hover {
            box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.04), 0 2px 6px 0 rgba(17, 49, 96, 0.24);
          }
        `}

  ${({ active }) => active && activeStyle}
`;

export default IconButtonContainer;

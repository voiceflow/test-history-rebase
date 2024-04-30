import type { IconButtonVariant } from '@/components/IconButton/types';
import SvgIcon from '@/components/SvgIcon';
import { colors, css, styled, ThemeColor, transition } from '@/styles';

import type { IconButtonContainerSharedProps } from './IconButtonContainer';
import IconButtonContainer from './IconButtonContainer';

export interface OutlineContainerProps extends IconButtonContainerSharedProps {
  color?: string;
  variant: IconButtonVariant.OUTLINE;
  withOpacity?: boolean;
  preventFocusStyle?: boolean;
}

const activeStyle = css<OutlineContainerProps>`
  color: ${({ color }) => color ?? 'rgba(19, 33, 68, 0.85)'};
  background: #eef4f6cc;
  border: 1px solid ${colors(ThemeColor.BORDERS)};
  box-shadow: none !important;
  opacity: 1;

  &:hover {
    color: ${({ color }) => color ?? 'rgba(19, 33, 68, 0.85)'};
  }
`;

const OutlineContainer = styled(IconButtonContainer as React.FC<OutlineContainerProps>)`
  ${transition('border', 'background', 'color', 'box-shadow', 'opacity')}
  color: ${({ color, theme }) => color ?? theme.colors.tertiary};
  background: ${colors(ThemeColor.WHITE)};
  border: 1px solid ${colors(ThemeColor.SEPARATOR_SECONDARY)};
  box-shadow: none !important;

  ${SvgIcon.Container} {
    opacity: 1;
  }

  &:hover {
    color: ${({ color, theme }) => color ?? theme.iconColors.active};
    border: 1px solid ${colors(ThemeColor.BORDERS)};
    box-shadow: none;
  }

  &:active {
    ${activeStyle}
  }

  ${({ withOpacity }) =>
    withOpacity &&
    css`
      opacity: 0.85;

      &:hover {
        opacity: 1;
      }
    `}

  ${({ preventFocusStyle }) =>
    !preventFocusStyle &&
    css`
      &:focus {
        color: ${colors(ThemeColor.PRIMARY)};
        background: #eef4f6cc;
        border: 1px solid ${colors(ThemeColor.BORDERS)};
        box-shadow: none !important;
      }
    `}

  ${({ active }) => active && activeStyle}
`;

export default OutlineContainer;

import { css, styled, transition, units } from '@ui/styles';
import { color, ColorProps, layout, LayoutProps } from 'styled-system';

import Header from './Header';
import LinkArrowIcon from './LinkArrowIcon';

export interface ContainerProps extends LayoutProps, Pick<ColorProps, 'backgroundColor'>, React.PropsWithChildren {
  isLink?: boolean;
  isAccent?: boolean;
  isCollapse?: boolean;
  isDragging?: boolean;
  onContextMenu?: React.MouseEventHandler;
  isContextMenuOpen?: boolean;
  isDraggingPreview?: boolean;
}

const Container = styled.section<ContainerProps>`
  ${transition('background')}

  position: relative;
  min-height: 58px;

  ${({ onClick }) =>
    onClick &&
    css`
      cursor: pointer;

      & > ${Header} {
        user-select: none;
      }
    `}

  ${({ onClick, isLink }) =>
    onClick &&
    isLink &&
    css`
      &:hover {
        > ${Header} ${LinkArrowIcon} {
          transform: rotate(90deg) translateY(-4px);
        }
      }
    `}

  ${({ isAccent, onClick, isCollapse }) =>
    onClick &&
    !isAccent &&
    css`
      &:hover {
        background: #eff5f660;
      }

      ${isCollapse &&
      css`
        & &:hover {
          background: none;
        }
      `}
    `}

  ${({ isAccent }) =>
    isAccent &&
    css`
      background: ${({ theme }) => theme.components.sectionV2.accentBackground};
    `}

  ${({ isDragging }) =>
    isDragging &&
    css`
      & > * {
        opacity: 0;
      }
    `}

  ${({ isDraggingPreview }) =>
    isDraggingPreview &&
    css`
      margin: 0 ${units(2)}px;
      background: linear-gradient(180deg, rgba(238, 244, 246, 0.3) 0%, rgba(238, 244, 246, 0.45) 100%), rgba(255, 255, 255, 0.8);
      box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.06), 0 ${units()}px ${units(2)}px 0 rgba(17, 49, 96, 0.16);
      border-radius: 7px;
    `}

  ${({ isContextMenuOpen }) =>
    isContextMenuOpen &&
    css`
      background: #eff5f660;
    `}

  ${color}
  ${layout}
`;

export default Container;

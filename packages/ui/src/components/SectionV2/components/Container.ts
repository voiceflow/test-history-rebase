import { css, styled, transition, units } from '@ui/styles';

import Header from './Header';
import LinkArrowIcon from './LinkArrowIcon';

export interface ContainerProps {
  isLink?: boolean;
  isAccent?: boolean;
  isDragging?: boolean;
  onContextMenu?: React.MouseEventHandler;
  isContextMenuOpen?: boolean;
  isDraggingPreview?: boolean;
}

const Container = styled.section<ContainerProps>`
  ${transition('background')}

  position: relative;
  padding: ${units()}px 0;

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

  ${({ isAccent, onClick }) =>
    onClick &&
    !isAccent &&
    css`
      &:hover {
        background: #eff5f660;
      }
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
      background: linear-gradient(-180deg, rgba(238, 244, 246, 0.3) 0%, rgba(238, 244, 246, 0.45) 100%), #fff;
    `}
`;

export default Container;

import { css, styled, units } from '@ui/styles';

import Content from './Content';
import Header from './Header';

export interface ContainerProps {
  isDragging?: boolean;
  isContextMenuOpen?: boolean;
  isDraggingPreview?: boolean;
}

const Container = styled.section<ContainerProps>`
  position: relative;
  padding: ${units()}px 0;

  ${({ isDragging }) =>
    isDragging &&
    css`
      & > ${Content} {
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

  ${({ onClick }) =>
    onClick &&
    css`
      cursor: pointer;

      ${Header} {
        user-select: none;
      }
    `}
`;

export default Container;

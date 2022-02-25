import React from 'react';

import { css, styled, StyledProps, transition } from '@/hocs';
import { SlideOut, SlideOutDirection, SlideOutProps } from '@/styles/transitions';

export type DrawerDirection = SlideOutDirection;

export interface DrawerProps {
  zIndex?: number;
  scrollable?: boolean;
  animatedWidth?: boolean;
  closable?: boolean;
  onToggle?: (value: boolean) => void;
}

export const DrawerContainer = styled(SlideOut)<DrawerProps>`
  height: 100%;
  top: 0;
  bottom: 0;
  border-style: solid;
  border-width: 0;
  border-color: #dfe3ed;
  background-color: #fff;

  z-index: ${({ zIndex = 20 }) => zIndex};

  ${({ open }) =>
    !open &&
    css`
      > * {
        visibility: hidden;
      }
    `}

  ${({ direction = SlideOutDirection.RIGHT }) =>
    direction === SlideOutDirection.RIGHT
      ? css`
          border-right-width: 1px;
        `
      : css`
          border-left-width: 1px;
        `}

  ${({ scrollable }) =>
    scrollable &&
    css`
      overflow-y: scroll;
    `}

  ${({ animatedWidth }) =>
    animatedWidth &&
    css`
      ${transition('width')}
    `}

  ${({ closable }) =>
    closable &&
    css`
      &:after {
        content: '';
        position: absolute;
        top: 50%;
        cursor: pointer;
        right: -12px;
        opacity: 0.5;
        border-radius: 3px;
        background-image: linear-gradient(to bottom, rgba(110, 132, 154, 0.85), #6e849a), linear-gradient(to bottom, white, white);
        width: 4px;
        height: 20px;
      }
    `}
`;

const CloseIcon = styled.div<{ open?: boolean }>`
  position: absolute;
  top: 50%;
  opacity: 0.5;
  border-radius: 3px;
  background-image: linear-gradient(to bottom, rgba(110, 132, 154, 0.85), #6e849a), linear-gradient(to bottom, white, white);
  width: 4px;
  height: 20px;
  z-index: 25;

  &:hover {
    background-image: linear-gradient(to bottom, rgba(61, 130, 226, 0.8), #3d82e2 100%), linear-gradient(to bottom, white, white);
    opacity: 1;
  }

  ${({ open }) =>
    open
      ? css`
          right: -12px;
          cursor: w-resize;
        `
      : css`
          left: 6px;
          cursor: e-resize;
        `}
`;

type DrawerElementProps = StyledProps<any> & SlideOutProps & DrawerProps & { as?: React.ElementType };

const Drawer: React.FC<DrawerElementProps> = ({ closable, open, children, onToggle, ...props }) => {
  return (
    <>
      {closable && <CloseIcon open={open} onClick={() => onToggle && onToggle(!open)} />}
      <DrawerContainer open={open} {...props}>
        {children}
        {closable && <CloseIcon open={open} onClick={() => onToggle && onToggle(!open)} />}
      </DrawerContainer>
    </>
  );
};

export default Drawer;

import React from 'react';
import { StyledProps } from 'styled-components';

import { SlideOutDirection, SlideOutProps } from '@/styles/transitions';

import { ClosableArea, CloseIcon, Container } from './components';
import { DrawerProps } from './types';

export interface DrawerComponentProps extends SlideOutProps, DrawerProps, StyledProps<any>, Omit<React.ComponentProps<'div'>, 'ref'> {}

const Drawer: React.FC<DrawerComponentProps> = ({ open, width, zIndex, closable, children, onToggle, direction, disableAnimation, ...props }) => (
  <>
    {closable && (
      <ClosableArea
        open={open}
        zIndex={zIndex}
        onClick={() => onToggle?.(!open)}
        direction={direction}
        drawerWidth={width}
        disableAnimation={disableAnimation}
      >
        <CloseIcon />
      </ClosableArea>
    )}

    <Container open={open} width={width} zIndex={zIndex} direction={direction} disableAnimation={disableAnimation} {...props}>
      {children}
    </Container>
  </>
);

export default Object.assign(Drawer, {
  Direction: SlideOutDirection,
  Container,
});

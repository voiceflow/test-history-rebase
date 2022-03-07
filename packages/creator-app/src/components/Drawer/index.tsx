import React from 'react';

import { StyledProps } from '@/hocs';
import { SlideOutProps } from '@/styles/transitions';

import { DrawerClosableArea, DrawerCloseIcon, DrawerContainer } from './components';
import { DrawerProps } from './types';

type DrawerElementProps = StyledProps<any> & SlideOutProps & DrawerProps & { as?: React.ElementType };

const Drawer: React.FC<DrawerElementProps> = ({ closable, open, children, onToggle, ...props }) => {
  return (
    <>
      {closable && (
        <DrawerClosableArea open={open} onClick={() => onToggle && onToggle(!open)}>
          <DrawerCloseIcon open={open} onClick={() => onToggle && onToggle(!open)} />
        </DrawerClosableArea>
      )}
      <DrawerContainer open={open} {...props}>
        {children}
        {closable && (
          <DrawerClosableArea open={open} onClick={() => onToggle && onToggle(!open)}>
            <DrawerCloseIcon open={open} onClick={() => onToggle && onToggle(!open)} />
          </DrawerClosableArea>
        )}
      </DrawerContainer>
    </>
  );
};

export { default as DrawerContainer } from './components/DrawerContainer';
export * from './types';

export default Drawer;

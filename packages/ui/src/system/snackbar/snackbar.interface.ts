import React from 'react';

export interface API {
  open: VoidFunction;
  close: VoidFunction;
  isOpen: boolean;
}

export interface BaseProps extends React.PropsWithChildren, React.HTMLAttributes<HTMLDivElement> {}

export interface WithOverlayProps extends BaseProps {
  showOverlay?: boolean;
}

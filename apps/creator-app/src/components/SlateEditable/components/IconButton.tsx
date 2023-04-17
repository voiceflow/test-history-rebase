import { System } from '@voiceflow/ui';
import React from 'react';

const IconButton = React.forwardRef<HTMLButtonElement, System.IconButton.I.Props>(
  ({ hoverBackground = false, activeBackground = false, ...props }, ref) => (
    <System.IconButton.Base ref={ref} hoverBackground={hoverBackground} activeBackground={activeBackground} {...props} />
  )
);

export default IconButton;

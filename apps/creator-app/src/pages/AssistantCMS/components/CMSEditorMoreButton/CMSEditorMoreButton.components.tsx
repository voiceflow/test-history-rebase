import { Menu, Popper, SquareButton } from '@voiceflow/ui-next';
import React from 'react';

import type { ICMSEditorMoreButton } from './CMSEditorMoreButton.interface';

export const CMSEditorMoreButton: React.FC<ICMSEditorMoreButton> = ({ disabled, children }) => (
  <Popper
    referenceElement={({ ref, isOpen, onOpen }) => (
      <SquareButton ref={ref} size="medium" disabled={disabled} isActive={isOpen} onClick={onOpen} iconName="More" />
    )}
  >
    {({ onClose }) => <Menu width="fit-content">{children({ onClose })}</Menu>}
  </Popper>
);

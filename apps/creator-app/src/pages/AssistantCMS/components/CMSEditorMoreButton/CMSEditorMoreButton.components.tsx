import { Menu, Popper, SquareButton } from '@voiceflow/ui-next';
import { useAtom } from 'jotai/react';
import React from 'react';

import { isEditorMenuOpen as isEditorMenuOpenAtom } from '@/pages/AssistantCMS/pages/CMSFunction/CMSFunction.atoms';

import type { ICMSEditorMoreButton } from './CMSEditorMoreButton.interface';

export const CMSEditorMoreButton: React.FC<ICMSEditorMoreButton> = ({ disabled, children }) => {
  const [isEditorMenuOpen, setIsEditorMenuOpen] = useAtom(isEditorMenuOpenAtom);

  return (
    <Popper
      isOpen={isEditorMenuOpen}
      onOpen={() => setIsEditorMenuOpen(true)}
      onClose={() => setIsEditorMenuOpen(false)}
      referenceElement={({ ref, isOpen, onOpen }) => (
        <SquareButton ref={ref} size="medium" disabled={disabled} isActive={isOpen} onClick={onOpen} iconName="More" />
      )}
    >
      {({ onClose }) => (
        <Menu width="fit-content" minWidth={0}>
          {children({ onClose })}
        </Menu>
      )}
    </Popper>
  );
};

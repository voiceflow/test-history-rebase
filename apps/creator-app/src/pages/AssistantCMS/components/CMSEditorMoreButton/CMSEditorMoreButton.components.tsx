import { tid } from '@voiceflow/style';
import { Menu, Popper, SquareButton } from '@voiceflow/ui-next';
import React from 'react';

import { EDITOR_TEST_ID } from '../../AssistantCMS.constant';
import type { ICMSEditorMoreButton } from './CMSEditorMoreButton.interface';

export const CMSEditorMoreButton: React.FC<ICMSEditorMoreButton> = ({ disabled, children }) => {
  const TEST_ID = tid(EDITOR_TEST_ID, 'more');

  return (
    <Popper
      testID={tid(TEST_ID, 'menu')}
      referenceElement={({ ref, isOpen, onOpen }) => (
        <SquareButton ref={ref} size="medium" disabled={disabled} isActive={isOpen} onClick={onOpen} iconName="More" testID={TEST_ID} />
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

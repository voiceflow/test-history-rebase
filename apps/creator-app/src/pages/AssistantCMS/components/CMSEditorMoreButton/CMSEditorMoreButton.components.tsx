import { Utils } from '@voiceflow/common';
import { Menu, MenuItem, Popper, SquareButton } from '@voiceflow/ui-next';
import React from 'react';

import type { ICMSEditorMoreButton } from './CMSEditorMoreButton.interface';

export const CMSEditorMoreButton: React.FC<ICMSEditorMoreButton> = ({ disabled, options }) => (
  <Popper
    referenceElement={({ ref, isOpen, onOpen }) => (
      <SquareButton ref={ref} size="medium" disabled={disabled} isActive={isOpen} onClick={onOpen} iconName="More" />
    )}
  >
    {({ onClose }) => (
      <Menu width="fit-content">
        {options.map(
          (option, index) =>
            option && (
              <MenuItem
                key={index}
                label={option.label}
                prefixIconName={option.prefixIcon}
                onClick={Utils.functional.chainVoid(onClose, option.onClick)}
              />
            )
        )}
      </Menu>
    )}
  </Popper>
);

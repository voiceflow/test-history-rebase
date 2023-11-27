import { Utils } from '@voiceflow/common';
import { Menu, MenuItem, Popper, SquareButton } from '@voiceflow/ui-next';
import React from 'react';

import { IModalHeaderMore } from './ModalHeaderMore.interface';

export const ModalHeaderMore: React.FC<IModalHeaderMore> = ({ width = 83, options }) => (
  <Popper
    placement="bottom-start"
    referenceElement={({ ref, isOpen, onToggle }) => <SquareButton ref={ref} size="xlarge" iconName="More" isActive={isOpen} onClick={onToggle} />}
  >
    {({ onClose }) => (
      <Menu width={width}>
        {options.map((item) => (
          <MenuItem key={item.name} label={item.name} onClick={Utils.functional.chain(onClose, item.onClick)} />
        ))}
      </Menu>
    )}
  </Popper>
);

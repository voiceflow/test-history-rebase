import { Utils } from '@voiceflow/common';
import { tid } from '@voiceflow/style';
import { Menu, Popper, SquareButton } from '@voiceflow/ui-next';
import React from 'react';

import type { IModalHeaderMore } from './ModalHeaderMore.interface';

export const ModalHeaderMore: React.FC<IModalHeaderMore> = ({ width = 83, options, testID }) => (
  <Popper
    placement="bottom-start"
    testID={tid(testID, 'menu')}
    referenceElement={({ ref, isOpen, onToggle }) => (
      <SquareButton ref={ref} size="xlarge" iconName="More" isActive={isOpen} onClick={onToggle} testID={testID} />
    )}
  >
    {({ onClose }) => (
      <Menu width={width}>
        {options.map((item) => (
          <Menu.Item
            key={item.name}
            label={item.name}
            onClick={item.disabled ? undefined : Utils.functional.chain(onClose, item.onClick)}
            disabled={item.disabled}
            testID={tid(testID, 'menu-item', item.testID)}
          />
        ))}
      </Menu>
    )}
  </Popper>
);

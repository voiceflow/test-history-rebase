import { Utils } from '@voiceflow/common';
import { Menu, MenuItem, Popper } from '@voiceflow/ui-next';
import React from 'react';

interface ICMSKnowledgeBaseTableNavigationRefreshRate {
  onClose: () => void;
  onSetRefreshRate: (rate: string) => () => void;
}

export const CMSKnowledgeBaseTableNavigationRefreshRate: React.FC<ICMSKnowledgeBaseTableNavigationRefreshRate> = ({ onClose, onSetRefreshRate }) => {
  return (
    <Popper
      placement="right-start"
      referenceElement={({ ref, popper, onOpen }) => (
        <MenuItem ref={ref} label="Refresh rate" suffixIconName="ArrowRightL" onClick={() => onOpen()}>
          {popper}
        </MenuItem>
      )}
    >
      {({ onClose: onCloseSubMenu }) => (
        <Menu width={94}>
          <MenuItem label="Never" onClick={Utils.functional.chainVoid(onSetRefreshRate('Never'), onCloseSubMenu, onClose)} />
          <MenuItem label="Daily" onClick={Utils.functional.chainVoid(onSetRefreshRate('Daily'), onCloseSubMenu, onClose)} />
          <MenuItem label="Weekly" onClick={Utils.functional.chainVoid(onSetRefreshRate('Weekly'), onCloseSubMenu, onClose)} />
          <MenuItem label="Monthly" onClick={Utils.functional.chainVoid(onSetRefreshRate('Monthly'), onCloseSubMenu, onClose)} />
        </Menu>
      )}
    </Popper>
  );
};

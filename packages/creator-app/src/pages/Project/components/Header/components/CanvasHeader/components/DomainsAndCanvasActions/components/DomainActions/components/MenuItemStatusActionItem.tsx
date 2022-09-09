import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Checkbox, Menu as UIMenu, Popper } from '@voiceflow/ui';
import React from 'react';

interface CheckBoxItemProps {
  status: BaseModels.Version.DomainStatus;
  onChange: (status: BaseModels.Version.DomainStatus) => void;
  activeStatus?: BaseModels.Version.DomainStatus;
  nullishCheck?: boolean;
}

const CheckBoxItem: React.FC<CheckBoxItemProps> = ({ status, onChange, children, activeStatus, nullishCheck }) => (
  <UIMenu.Item onClick={() => onChange(status)} readOnly>
    <Checkbox type={Checkbox.Type.RADIO} isFlat checked={status === activeStatus || (nullishCheck && !activeStatus)} onChange={Utils.functional.noop}>
      {children}
    </Checkbox>
  </UIMenu.Item>
);

export interface MenuItemStatusActionItemProps {
  status?: BaseModels.Version.DomainStatus;
  onChange: (status: BaseModels.Version.DomainStatus) => void;
}

const MenuItemStatusActionItem: React.FC<MenuItemStatusActionItemProps> = ({ status, onChange }) => (
  <Popper
    width={142}
    inline
    modifiers={{ offset: { offset: '0,0' } }}
    placement="right-start"
    portalNode={document.body}
    renderContent={() => (
      <UIMenu inline>
        <CheckBoxItem status={BaseModels.Version.DomainStatus.DESIGN} onChange={onChange} activeStatus={status} nullishCheck>
          Design
        </CheckBoxItem>

        <CheckBoxItem status={BaseModels.Version.DomainStatus.REVIEW} onChange={onChange} activeStatus={status}>
          Review
        </CheckBoxItem>

        <CheckBoxItem status={BaseModels.Version.DomainStatus.COMPLETE} onChange={onChange} activeStatus={status}>
          Complete
        </CheckBoxItem>
      </UIMenu>
    )}
  >
    {({ ref, popper, onClose, isOpened, onToggle }) => (
      <UIMenu.Item ref={ref} active={isOpened} onMouseEnter={onToggle} onMouseLeave={onClose}>
        Status
        <UIMenu.ItemNextIcon />
        {popper}
      </UIMenu.Item>
    )}
  </Popper>
);

export default MenuItemStatusActionItem;

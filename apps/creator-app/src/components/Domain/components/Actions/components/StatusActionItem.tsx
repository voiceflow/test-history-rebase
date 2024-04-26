import { BaseModels } from '@voiceflow/base-types';
import { Menu, Popper } from '@voiceflow/ui';
import React from 'react';

import { STATUS_LABELS_MAP } from '../constants';
import CheckBoxItem from './CheckBoxItem';

export interface StatusActionItemProps {
  status?: BaseModels.Version.DomainStatus;
  onChange: (status: BaseModels.Version.DomainStatus) => void;
}

const StatusActionItem: React.FC<StatusActionItemProps> = ({ status, onChange }) => (
  <Popper
    width={142}
    inline
    modifiers={{ offset: { offset: '0,0' } }}
    placement="right-start"
    portalNode={document.body}
    renderContent={() => (
      <Menu inline>
        <CheckBoxItem
          status={BaseModels.Version.DomainStatus.DESIGN}
          onChange={onChange}
          activeStatus={status}
          nullishCheck
        >
          {STATUS_LABELS_MAP[BaseModels.Version.DomainStatus.DESIGN]}
        </CheckBoxItem>

        <CheckBoxItem status={BaseModels.Version.DomainStatus.REVIEW} onChange={onChange} activeStatus={status}>
          {STATUS_LABELS_MAP[BaseModels.Version.DomainStatus.REVIEW]}
        </CheckBoxItem>

        <CheckBoxItem status={BaseModels.Version.DomainStatus.COMPLETE} onChange={onChange} activeStatus={status}>
          {STATUS_LABELS_MAP[BaseModels.Version.DomainStatus.COMPLETE]}
        </CheckBoxItem>
      </Menu>
    )}
  >
    {({ ref, popper, onClose, isOpened, onToggle }) => (
      <Menu.Item ref={ref} active={isOpened} onMouseEnter={onToggle} onMouseLeave={onClose}>
        Status
        <Menu.ItemNextIcon />
        {popper}
      </Menu.Item>
    )}
  </Popper>
);

export default StatusActionItem;

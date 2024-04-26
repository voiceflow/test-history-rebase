import type { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Checkbox, Menu as UIMenu } from '@voiceflow/ui';
import React from 'react';

interface CheckBoxItemProps extends React.PropsWithChildren {
  status: BaseModels.Version.DomainStatus;
  onChange: (status: BaseModels.Version.DomainStatus) => void;
  activeStatus?: BaseModels.Version.DomainStatus;
  nullishCheck?: boolean;
}

const CheckBoxItem: React.FC<CheckBoxItemProps> = ({ status, onChange, children, activeStatus, nullishCheck }) => (
  <UIMenu.Item onClick={() => onChange(status)} readOnly>
    <Checkbox
      type={Checkbox.Type.RADIO}
      isFlat
      checked={status === activeStatus || (nullishCheck && !activeStatus)}
      onChange={Utils.functional.noop}
    >
      {children}
    </Checkbox>
  </UIMenu.Item>
);

export default CheckBoxItem;

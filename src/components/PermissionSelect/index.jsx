import React from 'react';

import Select from '@/components/Select';
import { PERMISSIONS, PERMISSION_LABELS, PermissionType } from '@/constants';

const PermissionSelect = ({ value, onChange, disabledOptions }) => (
  <Select
    classNamePrefix="select-box"
    value={value ? { value, label: PERMISSION_LABELS[value] } : null}
    onChange={(result) => onChange(result.value)}
    placeholder="Select User Permission"
    options={PERMISSIONS.map((permission) => ({
      value: permission.value,
      label: permission.name,
    }))}
    isOptionDisabled={(option) => option.value !== PermissionType.PRODUCT && disabledOptions.includes(option.value)}
  />
);

export default PermissionSelect;

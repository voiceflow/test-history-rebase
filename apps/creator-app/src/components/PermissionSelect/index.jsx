import { Select } from '@voiceflow/ui';
import React from 'react';

import { PERMISSION_LABELS, PERMISSIONS } from '@/constants';

const PermissionSelect = ({ value, onChange, disabledOptions }) => (
  <Select
    value={value ? PERMISSION_LABELS[value] : null}
    options={PERMISSIONS.map((permission) => ({
      value: permission.value,
      label: permission.name,
    }))}
    optionsFilter={(options) => ({
      matchedOptions: options.filter((option) => option.value === value || !disabledOptions.includes(option.value)),
    })}
    getOptionValue={(option) => option.value}
    renderOptionLabel={(option) => option.label}
    onSelect={onChange}
    placeholder="Select User Permission"
  />
);

export default PermissionSelect;

import React from 'react';

import Select from '@/componentsV2/Select';
import { PERMISSIONS, PERMISSION_LABELS, PermissionType } from '@/constants';

const PermissionSelect = ({ value, onChange, disabledOptions }) => (
  <Select
    value={value ? PERMISSION_LABELS[value] : null}
    options={PERMISSIONS.map((permission) => ({
      value: permission.value,
      label: permission.name,
    }))}
    optionsFilter={(options) => ({
      filteredOptions: options.filter(
        (option) => option.value === value || option.value === PermissionType.PRODUCT || !disabledOptions.includes(option.value)
      ),
      matchedOptions: [],
    })}
    getOptionValue={(option) => option.value}
    renderOptionLabel={(option) => option.label}
    onSelect={onChange}
    placeholder="Select User Permission"
  />
);

export default PermissionSelect;

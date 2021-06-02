import _constant from 'lodash/constant';
import React from 'react';

import BaseDropdown from '@/components/Dropdown';
import Menu, { MenuItem } from '@/components/Menu';
import { SectionToggleVariant } from '@/components/Section';
import Icon from '@/components/SvgIcon';
import { UserRole } from '@/constants';
import { styled } from '@/hocs';

import DropdownButton from './DropdownButton';

type PermissionDropdownProps = {
  options?: { value: UserRole; label: string }[];
  onSelect?: (value: UserRole) => void;
  onRemove?: () => void;
  selectedValue: UserRole;
  orientation: string;
  hasError?: boolean;
  isDisabled?: boolean;
};

// styled components
const Dropdown = styled(BaseDropdown)`
  border-left: 0;
`;

const PermissionsDropdown: React.FC<PermissionDropdownProps> = ({
  options = [],
  onSelect,
  onRemove,
  selectedValue,
  orientation,
  hasError,
  isDisabled,
}) => {
  const dropdownValue =
    selectedValue === UserRole.ADMIN ? { value: UserRole.EDITOR, label: 'OWNER' } : options.filter((option) => option.value === selectedValue)?.[0];

  return (
    <Dropdown
      menu={
        <Menu>
          {options.map(({ label, value }, index) => (
            <MenuItem key={index} onClick={() => onSelect?.(value)}>
              {label}
            </MenuItem>
          ))}
          <MenuItem divider />
          <MenuItem onClick={onRemove}>Remove</MenuItem>
        </Menu>
      }
    >
      {(ref, onToggle, isOpen) => (
        <DropdownButton orientation={orientation} ref={ref} onClick={isDisabled ? _constant(null) : onToggle} error={hasError} active={isOpen}>
          {dropdownValue?.label?.toUpperCase()}
          {!isDisabled && <Icon icon={SectionToggleVariant.TOGGLE as any} size={10} color="currentColor" />}
        </DropdownButton>
      )}
    </Dropdown>
  );
};

export default PermissionsDropdown;

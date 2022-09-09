import { UserRole } from '@voiceflow/internal';
import { Dropdown as BaseDropdown, Menu, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { SectionToggleVariant } from '@/components/Section';
import { styled } from '@/hocs';

import DropdownButton from './DropdownButton';

interface PermissionDropdownProps {
  options?: { value: UserRole; label: string }[];
  onSelect?: (value: UserRole) => void;
  onRemove?: () => void;
  selectedValue: UserRole;
  orientation: string;
  hasError?: boolean;
}

// styled components
const Dropdown = styled(BaseDropdown)`
  border-left: 0;
`;

const PermissionsDropdown: React.FC<PermissionDropdownProps> = ({ options = [], onSelect, onRemove, selectedValue, orientation, hasError }) => {
  const dropdownValue =
    selectedValue === UserRole.ADMIN ? { value: UserRole.EDITOR, label: 'OWNER' } : options.filter((option) => option.value === selectedValue)?.[0];

  return (
    <Dropdown
      menu={
        <Menu>
          {options.map(({ label, value }, index) => (
            <Menu.Item key={index} onClick={() => onSelect?.(value)}>
              {label}
            </Menu.Item>
          ))}
          <Menu.Item divider />
          <Menu.Item onClick={onRemove}>Remove</Menu.Item>
        </Menu>
      }
    >
      {(ref, onToggle, isOpen) => (
        <DropdownButton orientation={orientation} ref={ref} onClick={onToggle} error={hasError} active={isOpen}>
          {dropdownValue?.label?.toUpperCase()}
          <SvgIcon icon={SectionToggleVariant.TOGGLE as any} size={10} color="currentColor" />
        </DropdownButton>
      )}
    </Dropdown>
  );
};

export default PermissionsDropdown;

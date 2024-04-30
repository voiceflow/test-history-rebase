import { UserRole } from '@voiceflow/internal';
import React from 'react';

import type { UIOnlyMenuItemOption } from '@/components/NestedMenu';
import { createDividerMenuItemOption } from '@/components/NestedMenu';

import * as S from './styles';

interface Option {
  label: string;
  onClick: VoidFunction;
}

export const ROLE_LABEL_MAP: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Admin',
  [UserRole.OWNER]: 'Owner',
  [UserRole.EDITOR]: 'Editor',
  [UserRole.VIEWER]: 'Viewer',
  [UserRole.BILLING]: 'Billing',
};

interface RoleSelectProps<T extends UserRole> {
  value: T;
  roles?: T[];
  label?: string;
  onChange: (role: T) => void;
  isInvite?: boolean;
  disabled?: boolean;
  onRemove?: VoidFunction | null;
  onResendInvite?: VoidFunction | null;
}

const DEFAULT_ROLES = [UserRole.EDITOR, UserRole.VIEWER, UserRole.ADMIN, UserRole.BILLING];

const RoleSelect = <T extends UserRole>({
  value,
  roles = DEFAULT_ROLES as T[],
  label,
  isInvite,
  disabled,
  onChange,
  onRemove,
  onResendInvite,
}: RoleSelectProps<T>): React.ReactElement => {
  const getOptions = () => {
    const options: Array<Option | UIOnlyMenuItemOption> = roles.map((role) => ({
      label: ROLE_LABEL_MAP[role],
      value: role,
      onClick: () => onChange(role),
    }));

    if (onRemove || (isInvite && onResendInvite)) {
      options.push(createDividerMenuItemOption('divider-2'));
    }

    if (onRemove) {
      options.push({ label: isInvite ? 'Remove from invites' : 'Remove', onClick: () => onRemove() });
    }

    if (isInvite && onResendInvite) {
      options.push({ label: 'Resend invite', onClick: () => onResendInvite() });
    }

    return options;
  };

  return (
    <S.StyledSelect
      label={label ?? ROLE_LABEL_MAP[value]}
      inline
      options={getOptions()}
      onSelect={(option) => option.onClick()}
      minWidth={false}
      disabled={disabled}
      autoWidth={false}
      placement="bottom"
      isDropdown
      borderLess
      modifiers={{ offset: { offset: -4 } }}
      getOptionKey={(option) => option.label}
      getOptionLabel={(option) => option?.label}
      isSecondaryInput
      syncOptionsOnRender
      showSearchInputIcon={!disabled}
      showDropdownColorOnActive
    />
  );
};

export default RoleSelect;

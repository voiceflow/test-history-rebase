import Checkbox, { CheckboxTypes } from '@ui/components/Checkbox';
import { createDividerMenuItemOption, defaultMenuLabelRenderer, UIOnlyMenuItemOption } from '@ui/components/NestedMenu';
import Select from '@ui/components/Select';
import { Utils } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal';
import React from 'react';

interface Option {
  label: string;
  value?: UserRole;
  onClick: VoidFunction;
  variant?: CheckboxTypes.Type;
}

interface RoleSelectProps {
  roles: UserRole[];
  onChange: (roles: UserRole[]) => void;
  isInvite?: boolean;
  onRemove?: VoidFunction;
  onResendInvite?: VoidFunction;
}

const RoleSelect: React.FC<RoleSelectProps> = ({ roles, isInvite, onChange, onRemove, onResendInvite }) => {
  const onChangeViewEditRole = (role: UserRole.EDITOR | UserRole.VIEWER) => {
    const rolesToRemove = new Set([UserRole.EDITOR, UserRole.VIEWER]);

    onChange([...roles.filter((r) => !rolesToRemove.has(r)), role]);
  };

  const onChangeAdminBillingRole = (role: UserRole.ADMIN | UserRole.BILLING) => {
    const rolesToRemove = new Set([UserRole.ADMIN, UserRole.BILLING]);

    onChange([...(roles.includes(role) ? roles.filter((r) => r !== role) : [...roles.filter((r) => !rolesToRemove.has(r)), role])]);
  };

  const getOptions = () => {
    const opts: Array<Option | UIOnlyMenuItemOption> = [
      { label: 'Can edit', value: UserRole.EDITOR, variant: Checkbox.Type.RADIO, onClick: () => onChangeViewEditRole(UserRole.EDITOR) },
      { label: 'Can view', value: UserRole.VIEWER, variant: Checkbox.Type.RADIO, onClick: () => onChangeViewEditRole(UserRole.VIEWER) },
      createDividerMenuItemOption('divider-1'),
      {
        label: `${isInvite ? 'Invite' : 'Assign'} as admin`,
        value: UserRole.ADMIN,
        variant: Checkbox.Type.CHECKBOX,
        onClick: () => onChangeAdminBillingRole(UserRole.ADMIN),
      },
      {
        label: `${isInvite ? 'Invite' : 'Assign'} as billing`,
        value: UserRole.BILLING,
        variant: Checkbox.Type.CHECKBOX,
        onClick: () => onChangeAdminBillingRole(UserRole.BILLING),
      },
    ];

    if (onRemove || onResendInvite) {
      opts.push(createDividerMenuItemOption('divider-2'));
    }

    if (onRemove) {
      opts.push({ label: 'Remove from invites', onClick: () => onRemove() });
    }
    if (onResendInvite) {
      opts.push({ label: 'Resend invite', onClick: () => onResendInvite() });
    }

    return opts;
  };

  return (
    <Select<Option>
      label={roles.includes(UserRole.VIEWER) ? 'Viewer' : 'Editor'}
      inline
      options={getOptions()}
      onSelect={(option) => option.onClick()}
      minWidth={false}
      autoWidth={false}
      isDropdown
      borderLess
      autoDismiss={false}
      getOptionKey={(option) => option.label}
      getOptionLabel={(option) => option?.label}
      isSecondaryInput
      syncOptionsOnRender
      showDropdownColorOnActive
      renderOptionLabel={(option, searchLabel, getOptionLabel, getOptionValue, config) => {
        const label = defaultMenuLabelRenderer(option, searchLabel, getOptionLabel, getOptionValue, config);

        if (!option.variant) return label;

        return (
          <Checkbox type={option.variant} isFlat checked={option.value && roles.includes(option.value)} onChange={Utils.functional.noop}>
            {label}
          </Checkbox>
        );
      }}
    />
  );
};

export default RoleSelect;

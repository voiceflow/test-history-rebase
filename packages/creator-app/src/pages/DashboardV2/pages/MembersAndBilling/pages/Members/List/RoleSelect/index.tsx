import { UserRole } from '@voiceflow/internal';
import { Select } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

interface TeamAndBillingMemberListRoleSelectProps {
  value: string;
  onChange: (value: string) => void;
  facets: Record<UserRole | 'all', number>;
}

const ROLES: Array<{ value: UserRole | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: UserRole.EDITOR, label: 'Editor' },
  { value: UserRole.VIEWER, label: 'Viewer' },
  { value: UserRole.ADMIN, label: 'Admin' },
  { value: UserRole.BILLING, label: 'Billing' },
  { value: UserRole.OWNER, label: 'Owner' },
];

const TeamAndBillingMemberListRoleSelect: React.FC<TeamAndBillingMemberListRoleSelectProps> = ({ value, onChange, facets }) => {
  const statusOptions = React.useMemo(() => ROLES.map((option) => ({ ...option, count: facets[option.value] ?? 0 })), [facets]);

  const selectValue = React.useMemo(() => statusOptions.find((option) => option.value === value)?.label, [value]);

  return (
    <Select
      value={selectValue}
      options={statusOptions}
      onSelect={(value) => onChange(value === 'all' ? '' : value)}
      placeholder={selectValue}
      renderOptionLabel={(option) => (
        <S.Option>
          <div>{option.label}</div>
          <S.Count>{option.count}</S.Count>
        </S.Option>
      )}
      prefix="ROLE"
      getOptionValue={(option) => option?.value}
      getOptionLabel={(label) => label}
      getOptionKey={(option) => option.value}
      width="145px"
    />
  );
};

export default TeamAndBillingMemberListRoleSelect;

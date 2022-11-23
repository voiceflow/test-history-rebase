import { UserRole } from '@voiceflow/internal';
import { Select } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

interface TeamAndBillingMemberListRoleSelectProps {
  value: string;
  onChange: (value: string) => void;
  facets: Record<UserRole | 'all', number>;
}

const roles = [
  { value: '', label: 'All' },
  {
    value: UserRole.EDITOR,
    label: 'Editor',
  },
  {
    value: UserRole.VIEWER,
    label: 'Viewer',
  },
  {
    value: UserRole.ADMIN,
    label: 'Admin',
  },
  {
    value: UserRole.BILLING,
    label: 'Billing',
  },
  {
    value: UserRole.OWNER,
    label: 'Owner',
  },
] as const;

const TeamAndBillingMemberListRoleSelect: React.FC<TeamAndBillingMemberListRoleSelectProps> = ({ value, onChange, facets }) => {
  const statusOptions = React.useMemo(() => roles.map((option) => ({ ...option, count: facets[option.value || 'all'] ?? 0 })), [facets]);

  const getOptionKey = React.useCallback((option) => option.value, []);
  const getOptionValue = React.useCallback((option) => option.value, []);
  const selectValue = React.useMemo(() => statusOptions.find((option) => option.value === value)?.label, [value]);

  return (
    <Select
      value={selectValue}
      options={statusOptions}
      onSelect={(option) => onChange(option || '')}
      placeholder={selectValue}
      renderOptionLabel={(option) => (
        <S.Option>
          <div>{option.label}</div>
          <S.Count>{option.count}</S.Count>
        </S.Option>
      )}
      prefix="ROLE"
      getOptionValue={getOptionValue}
      getOptionLabel={(label) => label}
      getOptionKey={getOptionKey}
      width="145px"
    />
  );
};

export default TeamAndBillingMemberListRoleSelect;

import { Utils } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal';
import { Select } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

interface TeamAndBillingMemberListRoleSelectProps {
  value: string;
  onChange: (value: string) => void;
  facets: Record<UserRole | 'all', number>;
}

const ROLES: Array<{ value: UserRole | 'all'; label: string; width: string }> = [
  { value: 'all', label: 'All', width: '116px' },
  { value: UserRole.EDITOR, label: 'Editor', width: '140px' },
  { value: UserRole.VIEWER, label: 'Viewer', width: '146px' },
  { value: UserRole.ADMIN, label: 'Admin', width: '142px' },
  { value: UserRole.BILLING, label: 'Billing', width: '142px' },
  { value: UserRole.OWNER, label: 'Owner', width: '146px' },
];

const TeamAndBillingMemberListRoleSelect: React.FC<TeamAndBillingMemberListRoleSelectProps> = ({ value, onChange, facets }) => {
  const [options, optionsMap] = React.useMemo(() => {
    const options = ROLES.map((option) => ({ ...option, count: facets[option.value] ?? 0 }));
    return [options, Utils.array.createMap(options, (option) => option.value)] as const;
  }, [facets, value]);

  return (
    <Select
      width={optionsMap[value as UserRole | 'all']?.width}
      value={value}
      options={options}
      onSelect={(value) => onChange(value)}
      placeholder={value}
      renderOptionLabel={(option) => (
        <S.Option>
          <div>{option.label}</div>
          <S.Count>{option.count}</S.Count>
        </S.Option>
      )}
      prefix="ROLE"
      getOptionValue={(option) => option?.value}
      getOptionLabel={(value) => value && optionsMap[value as UserRole | 'all'].label}
      getOptionKey={(option) => option.value}
    />
  );
};

export default TeamAndBillingMemberListRoleSelect;

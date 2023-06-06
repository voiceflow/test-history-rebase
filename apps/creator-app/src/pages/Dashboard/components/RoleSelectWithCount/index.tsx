import { Utils } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Select } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';
import { getRoleFacets } from './utils';

interface RoleSelectWithCountProps {
  value: string;
  members: Realtime.AnyWorkspaceMember[];
  onChange: (value: string) => void;
}

const ROLES: Array<{ value: UserRole | 'all'; label: string; width: string }> = [
  { value: 'all', label: 'All', width: '116px' },
  { value: UserRole.EDITOR, label: 'Editor', width: '140px' },
  { value: UserRole.VIEWER, label: 'Viewer', width: '146px' },
  { value: UserRole.ADMIN, label: 'Admin', width: '142px' },
  { value: UserRole.BILLING, label: 'Billing', width: '142px' },
];

const RoleSelectWithCount: React.FC<RoleSelectWithCountProps> = ({ value, onChange, members }) => {
  const [options, optionsMap] = React.useMemo(() => {
    const facets = getRoleFacets(members);
    const options = ROLES.map((option) => ({ ...option, count: facets[option.value] ?? 0 }));

    return [options, Utils.array.createMap(options, (option) => option.value)] as const;
  }, [members]);

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
      getOptionKey={(option) => option.value}
      getOptionValue={(option) => option?.value}
      getOptionLabel={(value) => value && optionsMap[value as UserRole | 'all'].label}
    />
  );
};

export default RoleSelectWithCount;

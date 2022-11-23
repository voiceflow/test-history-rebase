import { UserRole } from '@voiceflow/internal';
import { TextButton, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import { useActiveWorkspace } from '@/hooks';

import PermissionDropdown from './PermissionDropdown';
import RoleSelect from './RoleSelect';
import * as S from './styles';
import { getRoleFacets } from './utils';

const DashboardV2TeamAndBillingMembersList: React.FC = () => {
  const workspace = useActiveWorkspace();

  const [search, setSearch] = React.useState('');
  const [role, setRole] = React.useState('');

  const clearFilters = usePersistFunction(() => {
    setSearch('');
    setRole('');
  });

  const members = workspace?.members || [];

  const filteredMembers = React.useMemo(() => {
    if (!members?.length || (!role && !search)) return members;

    const lowSearch = search.toLowerCase();

    return members.filter((member) => {
      if (role && member.role !== role) return false;
      if (search) {
        return member.name?.toLowerCase().includes(lowSearch) || member.email?.toLocaleLowerCase().includes(lowSearch);
      }
      return true;
    });
  }, [search, role, members]);

  return (
    <S.Container>
      <S.Header>
        <S.Filters>
          <S.Input
            icon={search ? 'close' : 'search'}
            value={search}
            iconProps={{
              color: '#6E849A',
              size: 14,
              style: { cursor: search ? 'pointer' : 'default' },
              onClick: () => setSearch(''),
            }}
            width={230}
            placeholder="Search"
            onChangeText={setSearch}
          />
          <RoleSelect value={role} onChange={setRole} facets={getRoleFacets(members)} />
        </S.Filters>
      </S.Header>
      <S.Body>
        {!filteredMembers.length ? (
          <S.NoResults>
            <div>
              No members found. <TextButton onClick={clearFilters}>Clear filters</TextButton>
            </div>
          </S.NoResults>
        ) : (
          filteredMembers.map((member) => (
            <S.Row key={member.email}>
              <S.Avatar large user={member} flat={!!member?.creator_id} />
              <S.Info>
                <S.Name>
                  {member.name} {[UserRole.ADMIN, UserRole.OWNER].includes(member.role) && <S.Badge>{member.role}</S.Badge>}
                </S.Name>
                <S.Email>{member.email}</S.Email>
              </S.Info>
              <PermissionDropdown member={member} />
            </S.Row>
          ))
        )}
      </S.Body>
    </S.Container>
  );
};

export default DashboardV2TeamAndBillingMembersList;

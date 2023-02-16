import { TextButton, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import SearchBar from '@/components/SearchBar';
import Workspace from '@/components/Workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';

import RoleSelect from './RoleSelect';
import * as S from './styles';
import { getRoleFacets } from './utils';

const DashboardV2TeamAndBillingMembersList: React.FC = () => {
  const members = useSelector(WorkspaceV2.active.allNormalizedMembersSelector);

  const [role, setRole] = React.useState('all');
  const [search, setSearch] = React.useState('');

  const clearFilters = usePersistFunction(() => {
    setSearch('');
    setRole('all');
  });

  const filteredMembers = React.useMemo(() => {
    if (!members.length || (!role && !search)) return members;

    const lowSearch = search.toLowerCase();

    return members.filter((member) => {
      if (role && role !== 'all' && member.role !== role) return false;

      if (search) {
        return member.name?.toLowerCase().includes(lowSearch) || member.email?.toLocaleLowerCase().includes(lowSearch);
      }

      return true;
    });
  }, [search, role, members]);

  const roleFacets = React.useMemo(() => getRoleFacets(members), [members]);

  return (
    <S.Container>
      <S.Header>
        <S.Filters>
          <SearchBar value={search} onSearch={setSearch} width={230} placeholder="Search" />
          <RoleSelect value={role} onChange={setRole} facets={roleFacets} />
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
          <Workspace.MemberList members={filteredMembers} />
        )}
      </S.Body>
    </S.Container>
  );
};

export default DashboardV2TeamAndBillingMembersList;

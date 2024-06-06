import React from 'react';

import SearchBar from '@/components/SearchBar';
import * as Workspace from '@/components/Workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';
import { MembersList, RoleSelectWithCount } from '@/pages/DashboardV2/components';

const WorkspaceMembersList: React.FC = () => {
  const members = useSelector(WorkspaceV2.active.members.allMembersListSelector);

  const [role, setRole] = React.useState('all');
  const [search, setSearch] = React.useState('');

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

  const onClearFilters = () => {
    setSearch('');
    setRole('all');
  };

  return (
    <MembersList
      filters={
        <>
          <SearchBar animateIn={false} value={search} onSearch={setSearch} width={230} placeholder="Search" />

          <RoleSelectWithCount value={role} onChange={setRole} members={members} />
        </>
      }
      onClearFilters={onClearFilters}
    >
      {filteredMembers.length && <Workspace.MemberList members={filteredMembers} />}
    </MembersList>
  );
};

export default WorkspaceMembersList;

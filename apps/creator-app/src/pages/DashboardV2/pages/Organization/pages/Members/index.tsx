import { Box, Members, Spinner } from '@voiceflow/ui';
import pluralize from 'pluralize';
import React from 'react';

import SearchBar from '@/components/SearchBar';
import * as Workspace from '@/components/Workspace';
import * as Account from '@/ducks/account';
import { useSelector } from '@/hooks/redux';
import { MembersList, RoleSelectWithCount } from '@/pages/DashboardV2/components';
import { isEditorUserRole } from '@/utils/role';

import { WorkspaceSelect } from './components';
import { useMembersFilters, useWorkspacesAndMembers } from './hooks';
import * as S from './styles';

const OrganizationMembers: React.FC = () => {
  const userID = useSelector(Account.userIDSelector)!;

  const {
    loading,
    workspaces,
    onRemoveMember,
    onUpdateMember,
    activeWorkspaceID,
    setActiveWorkspaceID,
    activeWorkspaceMembers,
    uniqueOrganizationMembersCount,
    uniqueOrganizationEditorsCount,
  } = useWorkspacesAndMembers();
  const { role, search, setRole, setSearch, filteredMembers, onClearFilters } = useMembersFilters(activeWorkspaceMembers);

  if (loading) {
    return (
      <Box.FlexCenter fullHeight fullWidth flexGrow={1}>
        <Spinner borderLess fillContainer />
      </Box.FlexCenter>
    );
  }

  return (
    <S.Container>
      <S.Header>
        <S.Title>
          {pluralize('Member', uniqueOrganizationMembersCount, true)} across {pluralize('Workspace', workspaces.length, true)}
        </S.Title>
        <Workspace.TakenSeatsMessage seats={uniqueOrganizationEditorsCount} label="Editor seats being used in this Organization." />
      </S.Header>

      <MembersList
        filters={
          <>
            <SearchBar animateIn={false} value={search} onSearch={setSearch} width={230} placeholder="Search" />

            <WorkspaceSelect value={activeWorkspaceID} workspaces={workspaces} onChange={setActiveWorkspaceID} />

            <RoleSelectWithCount value={role} onChange={setRole} members={activeWorkspaceMembers} />
          </>
        }
        onClearFilters={onClearFilters}
      >
        {filteredMembers.length && (
          <Members.List
            members={filteredMembers}
            onRemove={onRemoveMember}
            onChangeRole={onUpdateMember}
            canEditOwner
            isEditorRole={isEditorUserRole}
            currentUserID={userID}
            hideLastDivider
          />
        )}
      </MembersList>
    </S.Container>
  );
};

export default OrganizationMembers;

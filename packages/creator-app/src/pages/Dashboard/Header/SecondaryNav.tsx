import { Box, Members } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { usePermission, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import { ProjectSearchContainer, ProjectSearchInput } from './components';

interface SecondaryNavProps {
  handleFilterText: (text: string) => void;
}

const SecondaryNav: React.FC<SecondaryNavProps> = ({ handleFilterText }) => {
  const members = useSelector(WorkspaceV2.active.normalizedMembersSelector);

  const collaboratorsModal = ModalsV2.useModal(ModalsV2.Collaborators);

  const [canAddCollaborators] = usePermission(Permission.ADD_COLLABORATORS);
  const [canViewCollaborators] = usePermission(Permission.VIEW_COLLABORATORS);

  return (
    <>
      <ProjectSearchContainer>
        <ProjectSearchInput
          icon="search"
          iconProps={{ color: '#8da2b5' }}
          placeholder="Search Projects"
          onChange={(e) => handleFilterText(e.target.value)}
        />
      </ProjectSearchContainer>

      {canViewCollaborators && (
        <Box.Flex ml={22}>
          <Members.AvatarList members={members} onAdd={canAddCollaborators ? () => collaboratorsModal.openVoid() : undefined} />
        </Box.Flex>
      )}
    </>
  );
};

export default SecondaryNav;

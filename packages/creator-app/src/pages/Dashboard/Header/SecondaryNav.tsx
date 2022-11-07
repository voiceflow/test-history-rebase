import * as Realtime from '@voiceflow/realtime-sdk';
import { Flex, Members } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import { usePermission } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import { ProjectSearchContainer, ProjectSearchInput } from './components';

interface SecondaryNavProps {
  workspace: Realtime.Workspace | null;
  handleFilterText: (text: string) => void;
}

const SecondaryNav: React.FC<SecondaryNavProps> = ({ workspace: selectedWorkspace, handleFilterText }) => {
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

      <Flex>
        {selectedWorkspace && canViewCollaborators && (
          <Members members={selectedWorkspace.members} onAdd={canAddCollaborators ? () => collaboratorsModal.openVoid() : undefined} />
        )}
      </Flex>
    </>
  );
};

export default SecondaryNav;

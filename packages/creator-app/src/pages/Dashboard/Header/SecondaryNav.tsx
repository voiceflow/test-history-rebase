import * as Realtime from '@voiceflow/realtime-sdk';
import { Flex } from '@voiceflow/ui';
import React from 'react';

import Members from '@/components/Members';
import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import { useModals, usePermission } from '@/hooks';

import { ProjectSearchContainer, ProjectSearchInput } from './components';

interface SecondaryNavProps {
  workspace: Realtime.Workspace | null;
  handleFilterText: (text: string) => void;
}

const SecondaryNav: React.FC<SecondaryNavProps> = ({ workspace: selectedWorkspace, handleFilterText }) => {
  const { toggle: toggleCollaborators } = useModals(ModalType.COLLABORATORS);
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
          <Members members={selectedWorkspace.members} onAdd={canAddCollaborators ? () => toggleCollaborators() : undefined} />
        )}
      </Flex>
    </>
  );
};

export default SecondaryNav;

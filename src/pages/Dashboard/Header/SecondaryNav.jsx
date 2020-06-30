import React from 'react';

import FlexCenter from '@/components/Flex';
import { Members } from '@/components/User';
import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import { planTypeSelector } from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useModals, usePermission } from '@/hooks';

import { ProjectSearchContainer, ProjectSearchInput } from './components';

function SecondaryNav({ workspace: selectedWorkspace, handleFilterText }) {
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

      <FlexCenter>
        {selectedWorkspace && canViewCollaborators && (
          <Members members={selectedWorkspace.members} onAdd={canAddCollaborators && (() => toggleCollaborators())} />
        )}
      </FlexCenter>
    </>
  );
}

const mapStateToProps = {
  plan: planTypeSelector,
};

export default connect(mapStateToProps)(SecondaryNav);

import React from 'react';

import FlexCenter from '@/components/Flex';
import { Members } from '@/components/User';
import { FEATURE_IDS, ModalType, UserRole } from '@/constants';
import { usePermissions } from '@/contexts';
import { planTypeSelector } from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useModals } from '@/hooks';

import { ProjectSearchContainer, ProjectSearchInput } from './components';

function SecondaryNav({ workspace: selectedWorkspace, handleFilterText }) {
  const { toggle: toggleCollaborators } = useModals(ModalType.COLLABORATORS);
  const [, userRole] = usePermissions(FEATURE_IDS.WORKSPACE_SETTINGS);
  const [canAddCollaborators] = usePermissions(FEATURE_IDS.ADD_COLLABORATORS);

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
        {selectedWorkspace && (
          <>
            {userRole !== UserRole.LIBRARY && (
              <Members members={selectedWorkspace.members} onAdd={canAddCollaborators && (() => toggleCollaborators())} />
            )}
          </>
        )}
      </FlexCenter>
    </>
  );
}

const mapStateToProps = {
  plan: planTypeSelector,
};

export default connect(mapStateToProps)(SecondaryNav);

import React from 'react';

import Flex from '@/components/Flex';
import { Members } from '@/components/User';
import { FEATURE_IDS, MODALS } from '@/constants';
import { useModals } from '@/contexts/ModalsContext';
import { usePermissions } from '@/contexts/RolePermissionsContext';
import { WorkspaceLoadingGate, WorkspaceMembersLoadingGate } from '@/gates';
import { connect, withBatchLoadingGate } from '@/hocs';
import { activeDiagramViewersSelector } from '@/store/selectors';
import { compose } from '@/utils/functional';

const CanvasViewers = ({ viewers }) => {
  const [canAddCollaborators] = usePermissions(FEATURE_IDS.ADD_COLLABORATORS);
  const { toggle: toggleCollaborators } = useModals(MODALS.COLLABORATORS);

  return (
    <Flex>
      <Members members={viewers} onAdd={canAddCollaborators && (() => toggleCollaborators())} />
    </Flex>
  );
};

const mapStateToProps = {
  viewers: activeDiagramViewersSelector,
};

export default compose(
  withBatchLoadingGate(WorkspaceLoadingGate, WorkspaceMembersLoadingGate),
  connect(mapStateToProps)
)(CanvasViewers);

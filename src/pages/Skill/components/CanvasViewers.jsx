import React from 'react';

import Flex from '@/components/Flex';
import { Members } from '@/components/User';
import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import { WorkspaceLoadingGate, WorkspaceMembersLoadingGate } from '@/gates';
import { connect, withBatchLoadingGate } from '@/hocs';
import { useModals, usePermission } from '@/hooks';
import { activeDiagramViewersSelector } from '@/store/selectors';
import { compose } from '@/utils/functional';

const CanvasViewers = ({ viewers }) => {
  const [canAddCollaborators] = usePermission(Permission.ADD_COLLABORATORS);
  const [canViewCollaborators] = usePermission(Permission.VIEW_COLLABORATORS);
  const { toggle: toggleCollaborators } = useModals(ModalType.COLLABORATORS);

  if (!canViewCollaborators) return null;

  return (
    <Flex>
      <Members members={viewers} onAdd={canAddCollaborators && (() => toggleCollaborators())} />
    </Flex>
  );
};

const mapStateToProps = {
  viewers: activeDiagramViewersSelector,
};

export default compose(withBatchLoadingGate(WorkspaceLoadingGate, WorkspaceMembersLoadingGate), connect(mapStateToProps))(CanvasViewers);

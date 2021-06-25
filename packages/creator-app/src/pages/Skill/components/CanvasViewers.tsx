import { Flex } from '@voiceflow/ui';
import React from 'react';

import { Members } from '@/components/User';
import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import * as Realtime from '@/ducks/realtime';
import { WorkspaceMembersLoadingGate } from '@/gates';
import { connect, withBatchLoadingGate } from '@/hocs';
import { useModals, usePermission } from '@/hooks';
import { ConnectedProps } from '@/types';
import { compose } from '@/utils/functional';

interface CanvasViewersProps {
  flat?: boolean;
  withAdd?: boolean;
}

const CanvasViewers: React.FC<CanvasViewersProps & ConnectedCanvasViewersProps> = ({ flat, viewers, withAdd = true }) => {
  const [canAddCollaborators] = usePermission(Permission.ADD_COLLABORATORS);
  const [canViewCollaborators] = usePermission(Permission.VIEW_COLLABORATORS);
  const { toggle: toggleCollaborators } = useModals(ModalType.COLLABORATORS);

  if (!canViewCollaborators) return null;

  return (
    <Flex>
      <Members flat={flat} members={viewers} onAdd={withAdd && canAddCollaborators ? () => toggleCollaborators() : undefined} />
    </Flex>
  );
};

const mapStateToProps = {
  viewers: Realtime.activeDiagramViewersSelector,
};

type ConnectedCanvasViewersProps = ConnectedProps<typeof mapStateToProps>;

export default compose(withBatchLoadingGate(WorkspaceMembersLoadingGate), connect(mapStateToProps))(CanvasViewers) as React.FC<CanvasViewersProps>;

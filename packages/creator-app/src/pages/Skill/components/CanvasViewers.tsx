import { Flex } from '@voiceflow/ui';
import React from 'react';

import Members from '@/components/Members';
import { FeatureFlag } from '@/config/features';
import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import * as Realtime from '@/ducks/realtime';
import * as RealtimeV2 from '@/ducks/realtimeV2';
import * as Session from '@/ducks/session';
import { WorkspaceMembersLoadingGate } from '@/gates';
import { connect, withBatchLoadingGate } from '@/hocs';
import { useFeature, useModals, usePermission, useRealtimeSelector } from '@/hooks';
import { ConnectedProps } from '@/types';
import { compose } from '@/utils/functional';

interface CanvasViewersProps {
  flat?: boolean;
  withAdd?: boolean;
}

const CanvasViewers: React.FC<CanvasViewersProps & ConnectedCanvasViewersProps> = ({ projectID, flat, viewers, withAdd = true }) => {
  const [canAddCollaborators] = usePermission(Permission.ADD_COLLABORATORS);
  const [canViewCollaborators] = usePermission(Permission.VIEW_COLLABORATORS);
  const { toggle: toggleCollaborators } = useModals(ModalType.COLLABORATORS);
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);
  const viewersV2 = useRealtimeSelector(RealtimeV2.projectViewersSelector)(projectID!);

  if (!canViewCollaborators) return null;

  return (
    <Flex>
      <Members
        flat={flat}
        members={atomicActions.isEnabled ? viewersV2 : viewers}
        onAdd={withAdd && canAddCollaborators ? () => toggleCollaborators() : undefined}
      />
    </Flex>
  );
};

const mapStateToProps = {
  projectID: Session.activeProjectIDSelector,
  viewers: Realtime.activeDiagramViewersSelector,
};

type ConnectedCanvasViewersProps = ConnectedProps<typeof mapStateToProps>;

export default compose(withBatchLoadingGate(WorkspaceMembersLoadingGate), connect(mapStateToProps))(CanvasViewers) as React.FC<CanvasViewersProps>;

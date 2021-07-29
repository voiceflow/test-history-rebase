import { Flex } from '@voiceflow/ui';
import React from 'react';

import Members from '@/components/Members';
import { FeatureFlag } from '@/config/features';
import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import * as Realtime from '@/ducks/realtime';
import * as RealtimeV2 from '@/ducks/realtimeV2';
import { WorkspaceMembersLoadingGate } from '@/gates';
import { withBatchLoadingGate } from '@/hocs';
import { useFeature, useModals, usePermission, useRealtimeSelector, useSelector } from '@/hooks';

interface CanvasViewersProps {
  flat?: boolean;
  withAdd?: boolean;
}

const CanvasViewers: React.FC<CanvasViewersProps> = ({ flat, withAdd = true }) => {
  const [canAddCollaborators] = usePermission(Permission.ADD_COLLABORATORS);
  const [canViewCollaborators] = usePermission(Permission.VIEW_COLLABORATORS);
  const { toggle: toggleCollaborators } = useModals(ModalType.COLLABORATORS);
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);
  const viewers = useSelector(Realtime.activeDiagramViewersSelector);
  const diagramIDs = useSelector(Diagram.allDiagramIDsSelector);
  const viewersV2 = useRealtimeSelector((state) => RealtimeV2.diagramsViewersSelector(state, diagramIDs));

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

export default withBatchLoadingGate(WorkspaceMembersLoadingGate)(CanvasViewers) as React.FC<CanvasViewersProps>;

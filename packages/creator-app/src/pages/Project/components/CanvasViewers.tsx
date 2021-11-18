import { BoxFlex } from '@voiceflow/ui';
import React from 'react';

import Members from '@/components/Members';
import { FeatureFlag } from '@/config/features';
import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Realtime from '@/ducks/realtime';
import { WorkspaceMembersLoadingGate } from '@/gates';
import { withBatchLoadingGate } from '@/hocs';
import { useFeature, useModals, usePermission, useSelector } from '@/hooks';

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
  const diagramIDs = useSelector(DiagramV2.allDiagramIDsSelector);
  const viewersV2 = useSelector((state) => DiagramV2.diagramsViewersByIDsSelector(state, { ids: diagramIDs }));

  if (!canViewCollaborators) return null;

  return (
    <BoxFlex minWidth={53}>
      <Members
        flat={flat}
        onAdd={withAdd && canAddCollaborators ? () => toggleCollaborators() : undefined}
        members={atomicActions.isEnabled ? viewersV2 : viewers}
      />
    </BoxFlex>
  );
};

export default withBatchLoadingGate(WorkspaceMembersLoadingGate)(CanvasViewers) as React.FC<CanvasViewersProps>;

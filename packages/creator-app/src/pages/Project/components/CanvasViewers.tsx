import { BoxFlex } from '@voiceflow/ui';
import React from 'react';

import Members from '@/components/Members';
import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import * as DiagramV2 from '@/ducks/diagramV2';
import { useModals, usePermission, useSelector } from '@/hooks';

interface CanvasViewersProps {
  flat?: boolean;
  withAdd?: boolean;
}

const CanvasViewers: React.FC<CanvasViewersProps> = ({ flat, withAdd = true }) => {
  const [canAddCollaborators] = usePermission(Permission.ADD_COLLABORATORS);
  const [canViewCollaborators] = usePermission(Permission.VIEW_COLLABORATORS);
  const { toggle: toggleCollaborators } = useModals(ModalType.COLLABORATORS);
  const diagramIDs = useSelector(DiagramV2.allDiagramIDsSelector);
  const viewers = useSelector(DiagramV2.diagramsViewersByIDsSelector, { ids: diagramIDs });

  if (!canViewCollaborators) return null;

  return (
    <BoxFlex minWidth={53}>
      <Members flat={flat} onAdd={withAdd && canAddCollaborators ? () => toggleCollaborators() : undefined} members={viewers} />
    </BoxFlex>
  );
};

export default CanvasViewers;

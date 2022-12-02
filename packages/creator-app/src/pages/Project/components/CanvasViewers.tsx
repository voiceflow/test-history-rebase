import { Box, Members } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import * as DiagramV2 from '@/ducks/diagramV2';
import { usePermission, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

interface CanvasViewersProps {
  flat?: boolean;
  withAdd?: boolean;
}

const CanvasViewers: React.FC<CanvasViewersProps> = ({ flat, withAdd = true }) => {
  const [canAddCollaborators] = usePermission(Permission.ADD_COLLABORATORS);
  const [canViewCollaborators] = usePermission(Permission.VIEW_COLLABORATORS);
  const collaboratorsModal = ModalsV2.useModal(ModalsV2.Collaborators);
  const diagramIDs = useSelector(DiagramV2.allDiagramIDsSelector);
  const viewers = useSelector(DiagramV2.diagramsViewersByIDsSelector, { ids: diagramIDs });

  if (!canViewCollaborators) return null;

  return (
    <Box.Flex minWidth={31} ml={22}>
      <Members.AvatarList flat={flat} onAdd={withAdd && canAddCollaborators ? () => collaboratorsModal.openVoid() : undefined} members={viewers} />
    </Box.Flex>
  );
};

export default CanvasViewers;

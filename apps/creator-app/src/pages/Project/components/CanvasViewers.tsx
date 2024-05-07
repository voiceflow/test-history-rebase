import { Box, Members } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import * as DiagramV2 from '@/ducks/diagramV2';
import { usePermission, useSelector } from '@/hooks';

const CanvasViewers: React.FC = () => {
  const [canViewCollaborators] = usePermission(Permission.VIEW_COLLABORATORS);

  const diagramIDs = useSelector(DiagramV2.allDiagramIDsSelector);
  const viewers = useSelector(DiagramV2.diagramsViewersByIDsSelector, { ids: diagramIDs });
  if (!canViewCollaborators) return null;

  return (
    <Box.Flex minWidth={31} ml={22}>
      <Members.AvatarList members={viewers} />
    </Box.Flex>
  );
};

export default CanvasViewers;

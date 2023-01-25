import { Box, Button } from '@voiceflow/ui';
import React from 'react';

import * as Settings from '@/components/Settings';
import { Permission } from '@/constants/permissions';
import { useActiveWorkspace, usePermission } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

const GeneralSettingsPage: React.FC = () => {
  const workspace = useActiveWorkspace();

  const [canDeleteWorkspace] = usePermission(Permission.DELETE_WORKSPACE);

  const boardDeleteModal = ModalsV2.useModal(ModalsV2.Board.Delete);

  return (
    <Box width={700}>
      {!!workspace && canDeleteWorkspace && (
        <Box.FlexApart alignItems="flex-start">
          <Settings.Section
            title={<Box.Flex>Delete Workspace</Box.Flex>}
            description={<>Delete the workspace, including all assistants. Proceed with caution.</>}
            mb={0}
            w={500}
          />
          <Button variant={Button.Variant.SECONDARY} onClick={() => boardDeleteModal.openVoid({ workspaceID: workspace.id })}>
            Delete Workspace
          </Button>
        </Box.FlexApart>
      )}
    </Box>
  );
};

export default GeneralSettingsPage;

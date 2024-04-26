import { Box, Button } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import { Permission } from '@/constants/permissions';
import { useActiveWorkspace, usePermission } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

const GeneralSettingsPage: React.FC = () => {
  const workspace = useActiveWorkspace();

  const [canDeleteWorkspace] = usePermission(Permission.DELETE_WORKSPACE);

  const boardDeleteModal = ModalsV2.useModal(ModalsV2.Board.Delete);

  return (
    <Page.Section
      header={
        !!workspace &&
        canDeleteWorkspace && (
          <Box.FlexApart fullWidth>
            <Page.Section.Header>
              <Page.Section.Title>Delete Workspace</Page.Section.Title>
              <Page.Section.Description>
                Delete the workspace, including all assistants. Proceed with caution.
              </Page.Section.Description>
            </Page.Section.Header>
            <Button
              variant={Button.Variant.SECONDARY}
              onClick={() => boardDeleteModal.openVoid({ workspaceID: workspace.id })}
            >
              Delete Workspace
            </Button>
          </Box.FlexApart>
        )
      }
    />
  );
};

export default GeneralSettingsPage;

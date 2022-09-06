import { Box, Button, Input, Upload, UploadIconVariant } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import { ActionSection, SectionVariants, SettingsSection } from '@/components/Settings';
import { Permission } from '@/config/permissions';
import * as Workspace from '@/ducks/workspace';
import { useActiveWorkspace, useDispatch, usePermission } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

const GeneralSettingsPage: React.FC = () => {
  const workspace = useActiveWorkspace()!;
  const updateActiveWorkspaceName = useDispatch(Workspace.updateActiveWorkspaceName);
  const updateActiveWorkspaceImage = useDispatch(Workspace.updateActiveWorkspaceImage);
  const [canDeleteWorkspace] = usePermission(Permission.DELETE_WORKSPACE);
  const [canConfigureWorkspace] = usePermission(Permission.CONFIGURE_WORKSPACE);

  const [name, updateName] = React.useState(workspace.name);

  const boardDeleteModal = ModalsV2.useModal(ModalsV2.Board.Delete);

  React.useEffect(() => {
    updateName(workspace.name);
  }, [workspace.id, workspace.name]);

  const saveName = React.useCallback(() => {
    if (name && name !== workspace.name) {
      updateActiveWorkspaceName(name);
    } else {
      updateName(workspace.name);
    }
  }, [name, updateName]);

  return (
    <>
      <SettingsSection title="General">
        <Section variant={SectionVariant.QUATERNARY} header="Workspace Name">
          <Box.Flex mb={24}>
            <Input name="name" value={name} onBlur={saveName} onChangeText={updateName} placeholder="Board Name" readOnly={!canConfigureWorkspace} />
            <Box ml={16}>
              <Upload.IconUpload
                disabled={!canConfigureWorkspace}
                size={UploadIconVariant.EXTRA_SMALL}
                update={updateActiveWorkspaceImage}
                image={workspace.image}
              />
            </Box>
          </Box.Flex>
        </Section>
      </SettingsSection>

      {canDeleteWorkspace && (
        <SettingsSection title="Danger Zone" variant={SectionVariants.SECONDARY}>
          <ActionSection
            heading="Delete Workspace"
            description="This action cannot be reverted, proceed with caution"
            action={<Button onClick={() => boardDeleteModal.openVoid({ workspace })}>Delete Workspace</Button>}
          />
        </SettingsSection>
      )}
    </>
  );
};

export default GeneralSettingsPage;

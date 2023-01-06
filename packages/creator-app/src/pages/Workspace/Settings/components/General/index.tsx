import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, Input, Upload, UploadIconVariant } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import { ActionSection, SectionVariants, SettingsSection } from '@/components/Settings';
import { Permission } from '@/config/permissions';
import * as Feature from '@/ducks/feature';
import * as Workspace from '@/ducks/workspace';
import { useActiveWorkspace, useDispatch, usePermission, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import * as Sentry from '@/vendors/sentry';

import { AIAssistSection } from './components';

const GeneralSettingsPage: React.OldFC = () => {
  const workspace = useActiveWorkspace()!;

  const isIdentityWorkspaceEnabled = useSelector(Feature.isFeatureEnabledSelector)(Realtime.FeatureFlag.IDENTITY_WORKSPACE);

  const updateActiveWorkspaceName = useDispatch(Workspace.updateActiveWorkspaceName);
  const updateActiveWorkspaceImage = useDispatch(Workspace.updateActiveWorkspaceImage);
  const updateActiveWorkspaceImageLegacy = useDispatch(Workspace.updateActiveWorkspaceImageLegacy);

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
              {isIdentityWorkspaceEnabled ? (
                <Upload.Provider client={{ upload: (_endpoint, _fileType, formData) => updateActiveWorkspaceImage(formData) }} onError={Sentry.error}>
                  <Upload.IconUpload size={UploadIconVariant.EXTRA_SMALL} image={workspace.image} disabled={!canConfigureWorkspace} />
                </Upload.Provider>
              ) : (
                <Upload.IconUpload
                  size={UploadIconVariant.EXTRA_SMALL}
                  image={workspace.image}
                  update={updateActiveWorkspaceImageLegacy}
                  disabled={!canConfigureWorkspace}
                />
              )}
            </Box>
          </Box.Flex>
        </Section>
      </SettingsSection>

      <AIAssistSection />

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

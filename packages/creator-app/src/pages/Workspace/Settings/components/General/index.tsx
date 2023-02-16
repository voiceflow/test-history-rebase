import { datadogRum } from '@datadog/browser-rum';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, Input, Upload, UploadIconVariant } from '@voiceflow/ui';
import React from 'react';

import * as Settings from '@/components/Settings';
import { Permission } from '@/constants/permissions';
import * as Feature from '@/ducks/feature';
import * as Workspace from '@/ducks/workspace';
import { useActiveWorkspace, useDispatch, usePermission, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import { AIAssistSection } from './components';

const GeneralSettingsPage: React.FC = () => {
  const workspace = useActiveWorkspace();

  const isIdentityWorkspaceEnabled = useSelector(Feature.isFeatureEnabledSelector)(Realtime.FeatureFlag.IDENTITY_WORKSPACE);

  const updateActiveWorkspaceName = useDispatch(Workspace.updateActiveWorkspaceName);
  const updateActiveWorkspaceImage = useDispatch(Workspace.updateActiveWorkspaceImage);
  const updateActiveWorkspaceImageLegacy = useDispatch(Workspace.updateActiveWorkspaceImageLegacy);

  const [canDeleteWorkspace] = usePermission(Permission.DELETE_WORKSPACE);
  const [canConfigureWorkspace] = usePermission(Permission.CONFIGURE_WORKSPACE);

  const [name, updateName] = React.useState(workspace?.name ?? '');

  const boardDeleteModal = ModalsV2.useModal(ModalsV2.Board.Delete);

  React.useEffect(() => {
    updateName(workspace?.name ?? '');
  }, [workspace?.name]);

  const saveName = React.useCallback(() => {
    if (name && name !== workspace?.name) {
      updateActiveWorkspaceName(name);
    } else if (workspace) {
      updateName(workspace.name);
    }
  }, [name, updateName, workspace?.name]);

  return (
    <>
      <Settings.Section title="General">
        <Settings.Card>
          <Settings.SubSection header="Workspace Name">
            <Box.FlexApart gap={16}>
              <Input
                name="name"
                value={name}
                onBlur={saveName}
                readOnly={!canConfigureWorkspace}
                onChangeText={updateName}
                placeholder="Board Name"
              />

              {isIdentityWorkspaceEnabled ? (
                <Upload.Provider
                  client={{ upload: (_endpoint, _fileType, formData) => updateActiveWorkspaceImage(formData) }}
                  onError={datadogRum.addError}
                >
                  <Upload.IconUpload size={UploadIconVariant.EXTRA_SMALL} image={workspace?.image} disabled={!canConfigureWorkspace} />
                </Upload.Provider>
              ) : (
                <Upload.IconUpload
                  size={UploadIconVariant.EXTRA_SMALL}
                  image={workspace?.image}
                  update={updateActiveWorkspaceImageLegacy}
                  disabled={!canConfigureWorkspace}
                />
              )}
            </Box.FlexApart>
          </Settings.SubSection>
        </Settings.Card>
      </Settings.Section>

      <AIAssistSection />

      {!!workspace && canDeleteWorkspace && (
        <Settings.Section title="Danger Zone">
          <Settings.ActionSubSection
            title="Delete Workspace"
            action={<Button onClick={() => boardDeleteModal.openVoid({ workspaceID: workspace.id })}>Delete Workspace</Button>}
            description="This action cannot be reverted, proceed with caution"
          />
        </Settings.Section>
      )}
    </>
  );
};

export default GeneralSettingsPage;

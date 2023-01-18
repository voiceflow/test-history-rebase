import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, Input, SectionV2, Upload, UploadIconVariant } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import { Permission } from '@/constants/permissions';
import * as Feature from '@/ducks/feature';
import * as Workspace from '@/ducks/workspace';
import { useActiveWorkspace, useDispatch, useLinkedState, usePermission, useSelector } from '@/hooks';
import * as Sentry from '@/vendors/sentry';

const GeneralSettingsPage: React.FC = () => {
  const workspace = useActiveWorkspace()!;

  const isIdentityWorkspaceEnabled = useSelector(Feature.isFeatureEnabledSelector)(Realtime.FeatureFlag.IDENTITY_WORKSPACE);

  const updateActiveWorkspaceName = useDispatch(Workspace.updateActiveWorkspaceName);
  const updateActiveWorkspaceImage = useDispatch(Workspace.updateActiveWorkspaceImage);
  const updateActiveWorkspaceImageLegacy = useDispatch(Workspace.updateActiveWorkspaceImageLegacy);

  const [canConfigureWorkspace] = usePermission(Permission.CONFIGURE_WORKSPACE);
  const [name, updateName] = useLinkedState(workspace.name);

  const saveName = React.useCallback(() => {
    if (name && name !== workspace.name) {
      updateActiveWorkspaceName(name);
    } else {
      updateName(workspace.name);
    }
  }, [name, updateName]);

  return (
    <Page.Section
      header={
        <Page.Section.Header>
          <Page.Section.Title>Workspace</Page.Section.Title>
        </Page.Section.Header>
      }
    >
      <SectionV2.SimpleSection headerProps={{ topUnit: 3, bottomUnit: 3 }}>
        <Box.Flex gap={24} fullWidth>
          {isIdentityWorkspaceEnabled ? (
            <Upload.Provider client={{ upload: (_endpoint, _fileType, formData) => updateActiveWorkspaceImage(formData) }} onError={Sentry.error}>
              <Upload.IconUpload size={UploadIconVariant.SMALLER} isSquare image={workspace.image} />
            </Upload.Provider>
          ) : (
            <Upload.IconUpload
              size={UploadIconVariant.SMALLER}
              isSquare
              image={workspace.image}
              update={updateActiveWorkspaceImageLegacy}
              disabled={!canConfigureWorkspace}
            />
          )}

          <Box.FlexAlignStart column gap={12} fullWidth>
            <SectionV2.Title bold secondary>
              Name
            </SectionV2.Title>

            <Box.FlexApart gap={16} fullWidth>
              <Input
                name="name"
                value={name}
                onBlur={saveName}
                readOnly={!canConfigureWorkspace}
                onChangeText={updateName}
                placeholder="Workspace Name"
              />

              <Button variant={Button.Variant.SECONDARY} flat>
                Save
              </Button>
            </Box.FlexApart>
          </Box.FlexAlignStart>
        </Box.Flex>
      </SectionV2.SimpleSection>
    </Page.Section>
  );
};

export default GeneralSettingsPage;

import { datadogRum } from '@datadog/browser-rum';
import { Box, Input, SectionV2, Upload, UploadIconVariant } from '@voiceflow/ui';
import React from 'react';

import { vfLogo } from '@/assets';
import Page from '@/components/Page';
import { Permission } from '@/constants/permissions';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useActiveWorkspace, useDispatch, useLinkedState, usePermission } from '@/hooks';

import * as S from './styles';

const GeneralSettingsPage: React.FC = () => {
  const workspace = useActiveWorkspace();

  const updateActiveWorkspaceName = useDispatch(WorkspaceV2.updateActiveWorkspaceName);
  const updateActiveWorkspaceImage = useDispatch(WorkspaceV2.updateActiveWorkspaceImage);

  const [canConfigureWorkspace] = usePermission(Permission.CONFIGURE_WORKSPACE);
  const [name, updateName] = useLinkedState(workspace?.name ?? '');

  const saveName = React.useCallback(() => {
    if (name && name !== workspace?.name) {
      updateActiveWorkspaceName(name);
    } else if (workspace) {
      updateName(workspace.name);
    }
  }, [name, updateName, workspace?.name]);

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
          <Upload.Provider
            client={{ upload: (_endpoint, _fileType, formData) => updateActiveWorkspaceImage(formData) }}
            onError={datadogRum.addError}
          >
            <S.UploadIcon size={UploadIconVariant.SMALLER} isSquare image={workspace?.image || vfLogo} />
          </Upload.Provider>

          <Box.FlexAlignStart column gap={11} fullWidth>
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
            </Box.FlexApart>
          </Box.FlexAlignStart>
        </Box.Flex>
      </SectionV2.SimpleSection>
    </Page.Section>
  );
};

export default GeneralSettingsPage;

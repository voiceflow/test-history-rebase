import { Box, BoxFlex, Button, Input } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import { ActionSection, SectionVariants, SettingsSection } from '@/components/Settings';
import { UploadIconVariant, UploadJustIcon } from '@/components/Upload/ImageUpload/IconUpload';
import { ModalType } from '@/constants';
import * as Workspace from '@/ducks/workspace';
import { useActiveWorkspace, useDispatch, useModals } from '@/hooks';

import BoardDeleteModal from './components/BoardDeleteModal';

const UploadJustIconComponent: React.FC<any> = UploadJustIcon;

const GeneralSettingsPage: React.FC = () => {
  const workspace = useActiveWorkspace()!;
  const updateActiveWorkspaceName = useDispatch(Workspace.updateActiveWorkspaceName);
  const updateActiveWorkspaceImage = useDispatch(Workspace.updateActiveWorkspaceImage);

  const [name, updateName] = React.useState(workspace.name);

  const { open: openDeleteModal } = useModals(ModalType.BOARD_DELETE);

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
          <BoxFlex mb={24}>
            <Input name="name" value={name} onBlur={saveName} onChange={(e) => updateName(e.target.value)} placeholder="Board Name" />
            <Box ml={16}>
              <UploadJustIconComponent
                size={UploadIconVariant.EXTRA_SMALL}
                update={updateActiveWorkspaceImage}
                image={workspace.image}
                endpoint="/image"
              />
            </Box>
          </BoxFlex>
        </Section>
      </SettingsSection>
      <SettingsSection title="Danger Zone" variant={SectionVariants.SECONDARY}>
        <ActionSection
          heading="Delete Workspace"
          description="This action cannot be reverted, proceed with caution"
          action={<Button onClick={openDeleteModal}>Delete Workspace</Button>}
        />
      </SettingsSection>
      <BoardDeleteModal workspace={workspace} />
    </>
  );
};

export default GeneralSettingsPage;

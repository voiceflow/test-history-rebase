import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box, { Flex } from '@/components/Box';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Section, { SectionVariant } from '@/components/Section';
import { ActionSection, SectionVariants, SettingsSection } from '@/components/Settings';
import { UploadIconVariant, UploadJustIcon } from '@/components/Upload/ImageUpload/IconUpload';
import { ModalType } from '@/constants';
import { activeWorkspaceSelector, updateWorkspaceImage, updateWorkspaceName } from '@/ducks/workspace';
import { useModals } from '@/hooks';

import BoardDeleteModal from './components/BoardDeleteModal';

const UploadJustIconComponent: React.FC<any> = UploadJustIcon;

const GeneralSettingsPage: React.FC = () => {
  const dispatch = useDispatch();
  const workspace = useSelector(activeWorkspaceSelector)!;

  const [name, updateName] = React.useState(workspace.name);

  const { open: openDeleteModal } = useModals(ModalType.BOARD_DELETE);

  React.useEffect(() => {
    updateName(workspace.name);
  }, [workspace.id, workspace.name]);

  const saveName = React.useCallback(() => {
    if (name && name !== workspace.name) {
      dispatch(updateWorkspaceName(name));
    } else {
      updateName(workspace.name);
    }
  }, [name, updateWorkspaceName, updateName]);

  return (
    <>
      <SettingsSection title="General">
        <Section variant={SectionVariant.QUATERNARY} header="Workspace Name">
          <Flex mb={24}>
            <Input name="name" value={name} onBlur={saveName} onChange={(e) => updateName(e.target.value)} placeholder="Board Name" />
            <Box ml={16}>
              <UploadJustIconComponent
                size={UploadIconVariant.EXTRA_SMALL}
                update={(image: string) => dispatch(updateWorkspaceImage(image))}
                image={workspace.image}
                endpoint="/image"
              />
            </Box>
          </Flex>
        </Section>
      </SettingsSection>
      <SettingsSection title="Danger Zone" variant={SectionVariants.SECONDARY}>
        <ActionSection
          heading="Delete Workspace"
          description="This action cannot be reverted, proceed with caution"
          action={
            <Button isBtn onClick={openDeleteModal} isLinkLarge>
              Delete Workspace
            </Button>
          }
        />
      </SettingsSection>
      <BoardDeleteModal workspace={workspace} />
    </>
  );
};

export default GeneralSettingsPage;

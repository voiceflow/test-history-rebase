import { Box, Button } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import { Permission } from '@/config/permissions';
import { usePermission } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import { WorkspaceSelector } from '../../../../components';
import { ImportButton, NotificationButton, SearchButton } from './components';

interface HeaderProps {
  search: string;
  onSearch: (text: string) => void;
}

const Header: React.FC<HeaderProps> = ({ search, onSearch }) => {
  const workspaceMembers = ModalsV2.useModal(ModalsV2.Workspace.Members);
  const projectCreateModal = ModalsV2.useModal(ModalsV2.Project.Create);
  const [canImportProject] = usePermission(Permission.IMPORT_PROJECT);
  const [canInviteMembers] = usePermission(Permission.INVITE);
  const [canCreateProject] = usePermission(Permission.EDIT_PROJECT);

  return (
    <Page.Header renderLogoButton={() => <WorkspaceSelector />}>
      <Page.Header.Title leftOffset>All Assistants</Page.Header.Title>

      <Page.Header.RightSection>
        <Box.Flex gap={4} mr={12}>
          <SearchButton value={search} onSearch={onSearch} />

          {canImportProject && <ImportButton />}

          <NotificationButton />
        </Box.Flex>

        <Box.Flex gap={10}>
          {canInviteMembers && (
            <Button variant={Button.Variant.SECONDARY} squareRadius onClick={() => workspaceMembers.openVoid()}>
              Invite
            </Button>
          )}

          {canCreateProject && (
            <Button variant={Button.Variant.PRIMARY} squareRadius onClick={() => projectCreateModal.openVoid({})}>
              New Assistant
            </Button>
          )}
        </Box.Flex>
      </Page.Header.RightSection>
    </Page.Header>
  );
};

export default Header;

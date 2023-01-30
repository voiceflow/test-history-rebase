import { Box, Button } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import { Permission } from '@/constants/permissions';
import { usePermission } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import { WorkspaceSelector } from '../../../../components';
import { ImportButton, NotificationButton, SearchButton } from './components';

interface HeaderProps {
  search?: string;
  onSearch?: (text: string) => void;
  isKanban?: boolean;
}

const Header: React.OldFC<HeaderProps> = ({ search, onSearch, isKanban }) => {
  const [canImportProject] = usePermission(Permission.IMPORT_PROJECT);
  const [canInviteMembers] = usePermission(Permission.INVITE);
  const [canCreateProject] = usePermission(Permission.EDIT_PROJECT);

  const inviteModal = ModalsV2.useModal(ModalsV2.Workspace.Invite);
  const projectCreateModal = ModalsV2.useModal(ModalsV2.Project.Create);

  return (
    <Page.Header renderLogoButton={() => <WorkspaceSelector />}>
      <Page.Header.Title leftOffset>All Assistants</Page.Header.Title>

      <Page.Header.RightSection rightOffset={false} mr={12}>
        <Box.Flex gap={4} mr={12}>
          {isKanban && onSearch && <SearchButton value={search} onSearch={onSearch} />}

          {canImportProject && <ImportButton />}

          <NotificationButton />
        </Box.Flex>

        <Box.Flex gap={8}>
          {canInviteMembers && (
            <Button variant={Button.Variant.SECONDARY} squareRadius onClick={() => inviteModal.openVoid()}>
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

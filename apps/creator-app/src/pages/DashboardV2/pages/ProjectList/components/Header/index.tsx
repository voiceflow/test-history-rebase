import { Box, Button } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import { LimitType } from '@/constants/limits';
import { Permission } from '@/constants/permissions';
import * as ProjectV2 from '@/ducks/projectV2';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { usePermission } from '@/hooks/permission';
import { usePlanLimitedConfig } from '@/hooks/planLimitV2';
import { useSelector } from '@/hooks/redux';
import * as ModalsV2 from '@/ModalsV2';

import { WorkspaceSelector } from '../../../../components';
import { ImportButton, NotificationButton, SearchButton } from './components';

interface HeaderProps {
  search?: string;
  onSearch?: (text: string) => void;
  isKanban?: boolean;
}

const Header: React.FC<HeaderProps> = ({ search, onSearch, isKanban }) => {
  const [canInviteMembers] = usePermission(Permission.INVITE);
  const [canImportProject] = usePermission(Permission.IMPORT_PROJECT);
  const [canCreateProject] = usePermission(Permission.PROJECT_EDIT);

  const projectsCount = useSelector(ProjectV2.projectsCountSelector);
  const projectsLimit = useSelector(WorkspaceV2.active.projectsLimitSelector);

  const projectsLimitConfig = usePlanLimitedConfig(LimitType.PROJECTS, { value: projectsCount, limit: projectsLimit });

  const inviteModal = ModalsV2.useModal(ModalsV2.Workspace.Invite);
  const upgradeModal = ModalsV2.useModal(ModalsV2.Upgrade);
  const projectCreateModal = ModalsV2.useModal(ModalsV2.Project.Create);

  const onCreateProject = () => {
    if (projectsLimitConfig) {
      upgradeModal.openVoid(projectsLimitConfig.upgradeModal(projectsLimitConfig.payload));
    } else {
      projectCreateModal.openVoid({});
    }
  };

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
            <Button variant={Button.Variant.PRIMARY} squareRadius onClick={onCreateProject}>
              New Assistant
            </Button>
          )}
        </Box.Flex>
      </Page.Header.RightSection>
    </Page.Header>
  );
};

export default Header;

import { Box, Dropdown, Menu, OverflowTippyTooltip, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { voiceflowLogomark } from '@/assets';
import { Permission } from '@/constants/permissions';
import * as Organization from '@/ducks/organization';
import * as Router from '@/ducks/router';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { usePermission, usePermissionAction } from '@/hooks/permission';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import * as ModalsV2 from '@/ModalsV2';
import { ClassName } from '@/styles/constants';

import * as S from './styles';

const WorkspaceSelector: React.FC = () => {
  const upgradeModal = ModalsV2.useModal(ModalsV2.Upgrade);
  const createWorkspaceModal = ModalsV2.useModal(ModalsV2.Workspace.Create);

  const workspaces = useSelector(WorkspaceV2.allWorkspacesSelector);
  const activeWorkspace = useSelector(WorkspaceV2.active.workspaceSelector);
  const isAdminOfAnyOrganization = useSelector(Organization.isAdminOfAnyOrganizationSelector);

  const goToWorkspace = useDispatch(Router.goToWorkspace);

  const [canCreatePrivateCloudWorkspace] = usePermission(Permission.PRIVATE_CLOUD_WORKSPACE_CREATE);

  const showCreateWorkspaceButton = isAdminOfAnyOrganization || canCreatePrivateCloudWorkspace;

  const onCreateWorkspace = usePermissionAction(Permission.WORKSPACE_CREATE, {
    onAction: () => createWorkspaceModal.openVoid(),
    onPlanForbid: ({ planConfig }) => upgradeModal.openVoid(planConfig.upgradeModal()),
  });

  return (
    <Dropdown
      offset={{ offset: [16, 0] }}
      menu={
        <Menu
          noMargins
          width={250}
          maxHeight={600}
          maxVisibleItems={15}
          renderFooterAction={() =>
            showCreateWorkspaceButton && (
              <Menu.Footer>
                <Menu.Footer.Action id="createWorkspace" onClick={() => onCreateWorkspace()}>
                  Create New Workspace
                </Menu.Footer.Action>
              </Menu.Footer>
            )
          }
        >
          {workspaces.map((workspace) => (
            <Menu.Item key={workspace.id} onClick={() => goToWorkspace(workspace.id)}>
              <S.ItemContainer>
                <S.Image src={workspace?.image || voiceflowLogomark} alt="logo" />
                <OverflowTippyTooltip content={workspace.name} overflow placement="top-start">
                  {(overflowRef) => (
                    <S.Name ref={overflowRef as React.RefObject<HTMLDivElement>}>{workspace.name}</S.Name>
                  )}
                </OverflowTippyTooltip>
              </S.ItemContainer>
            </Menu.Item>
          ))}
        </Menu>
      }
      placement="bottom"
    >
      {({ ref, onToggle, isOpen }) => (
        <S.Container
          id="workspaceDropdown"
          className={`${ClassName.DROPDOWN}--active-workspace`}
          onClick={onToggle}
          ref={ref}
          isOpen={isOpen}
        >
          <Box.Flex>
            <S.Image src={activeWorkspace?.image || voiceflowLogomark} alt="logo" active />
            <OverflowTippyTooltip content={activeWorkspace?.name} overflow placement="bottom-start">
              {(overflowRef) => (
                <S.Name ref={overflowRef as React.RefObject<HTMLDivElement>}>{activeWorkspace?.name}</S.Name>
              )}
            </OverflowTippyTooltip>
          </Box.Flex>

          <SvgIcon icon="arrowRightTopics" color="#6e849a" size={10} rotation={90} />
        </S.Container>
      )}
    </Dropdown>
  );
};

export default WorkspaceSelector;

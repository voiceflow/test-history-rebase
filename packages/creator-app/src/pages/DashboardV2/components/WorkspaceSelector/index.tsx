import { Box, Dropdown, Menu, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { vfLogo } from '@/assets';
import { Permission } from '@/config/permissions';
import { LimitType } from '@/config/planLimitV2';
import * as Router from '@/ducks/router';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, usePermission, usePlanLimitedAction, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { ClassName } from '@/styles/constants';

import * as S from './styles';

const WorkspaceSelector: React.FC = () => {
  const upgradeModal = ModalsV2.useModal(ModalsV2.Upgrade);

  const [canCreatePrivateCloudWorkspace] = usePermission(Permission.CREATE_PRIVATE_CLOUD_WORKSPACE);

  const workspaces = useSelector(WorkspaceV2.allWorkspacesSelector);
  const activeWorkspace = useSelector(WorkspaceV2.active.workspaceSelector);
  const isAdminOfAnyWorkspace = useSelector(WorkspaceV2.isAdminOfAnyWorkspaceSelector);

  const goToWorkspace = useDispatch(Router.goToWorkspace);
  const goToNewWorkspace = useDispatch(Router.goToNewWorkspace);

  const showCreateWorkspaceButton = isAdminOfAnyWorkspace || canCreatePrivateCloudWorkspace;

  const onCreateWorkspace = usePlanLimitedAction({
    type: LimitType.WORKSPACES,
    onAction: () => goToNewWorkspace(),
    onLimited: (limit) => upgradeModal.openVoid(limit.upgradeModal),
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
                <S.Image src={workspace?.image || vfLogo} alt="logo" />
                <S.Name>{workspace.name}</S.Name>
              </S.ItemContainer>
            </Menu.Item>
          ))}
        </Menu>
      }
      placement="bottom"
    >
      {(ref, onToggle, isOpen) => (
        <S.Container id="workspaceDropdown" className={`${ClassName.DROPDOWN}--active-workspace`} onClick={onToggle} ref={ref} isOpen={isOpen}>
          <Box.Flex>
            <S.Image src={activeWorkspace?.image || vfLogo} alt="logo" active />
            <S.Name>{activeWorkspace?.name}</S.Name>
          </Box.Flex>

          <SvgIcon icon="arrowRightTopics" color="#6e849a" size={10} rotation={90} />
        </S.Container>
      )}
    </Dropdown>
  );
};

export default WorkspaceSelector;

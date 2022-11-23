import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Dropdown, Menu, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { logo } from '@/assets';
import { Permission } from '@/config/permissions';
import { canAddWorkspace, WorkspacesLimitDetails } from '@/config/planLimits/workspaces';
import { ModalType } from '@/constants';
import * as Router from '@/ducks/router';
import { UpgradePrompt } from '@/ducks/tracking';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useModals, usePermission, useSelector } from '@/hooks';
import { ClassName } from '@/styles/constants';

import * as S from './styles';

interface WorkspaceSelectorProps {
  activeWorkspace: Realtime.Workspace | null;
}

const WorkspaceSelector: React.FC<WorkspaceSelectorProps> = ({ activeWorkspace }) => {
  const plan = useSelector(WorkspaceV2.active.planSelector);
  const [canCreatePrivateCloudWorkspace] = usePermission(Permission.CREATE_PRIVATE_CLOUD_WORKSPACE);
  const isAdminOfAnyWorkspace = useSelector(WorkspaceV2.isAdminOfAnyWorkspaceSelector);
  const workspaces = useSelector(WorkspaceV2.allWorkspacesSelector);
  const { open: openUpgradeModal } = useModals(ModalType.UPGRADE_MODAL);

  const goToWorkspace = useDispatch(Router.goToWorkspace);
  const goToNewWorkspace = useDispatch(Router.goToNewWorkspace);

  const showCreateWorkspaceButton = isAdminOfAnyWorkspace || canCreatePrivateCloudWorkspace;

  const canAddNewWorkspace = () => {
    if (!canAddWorkspace(plan)) {
      openUpgradeModal({ planLimitDetails: WorkspacesLimitDetails, promptOrigin: UpgradePrompt.WORKSPACE_LIMIT });
    } else {
      goToNewWorkspace();
    }
  };

  return (
    <>
      <Dropdown
        offset={{ offset: [16, 0] }}
        menu={
          <Menu
            width={250}
            maxHeight={600}
            maxVisibleItems={15}
            renderFooterAction={() =>
              showCreateWorkspaceButton ? (
                <Menu.Footer>
                  <Menu.Footer.Action id="createWorkspace" onClick={canAddNewWorkspace}>
                    Create New Workspace
                  </Menu.Footer.Action>
                </Menu.Footer>
              ) : null
            }
          >
            {workspaces.map((workspace) => {
              return (
                <Menu.Item key={workspace.id} onClick={() => goToWorkspace(workspace.id)}>
                  <S.WorkspaceItemContainer>
                    <S.WorkspaceImage src={workspace?.image || logo} alt="logo" />
                    <S.WorkspaceName>{workspace.name}</S.WorkspaceName>
                  </S.WorkspaceItemContainer>
                </Menu.Item>
              );
            })}
          </Menu>
        }
        placement="bottom"
      >
        {(ref, onToggle, isOpen) => (
          <S.WorkspaceSelectorContainer
            id="workspaceDropdown"
            className={`${ClassName.DROPDOWN}--active-workspace`}
            onClick={onToggle}
            ref={ref}
            isOpen={isOpen}
          >
            <Box.Flex>
              <S.WorkspaceImage src={activeWorkspace?.image || logo} alt="logo" active />
              <S.WorkspaceName>{activeWorkspace?.name}</S.WorkspaceName>
            </Box.Flex>
            <SvgIcon icon="arrowRightTopics" color="#6e849a" size={10} rotation={90} />
          </S.WorkspaceSelectorContainer>
        )}
      </Dropdown>
    </>
  );
};

export default WorkspaceSelector;

import { Utils } from '@voiceflow/common';
import { Dropdown, FlexApart, Menu, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import PlanBubble from '@/components/PlanBubble';
import { IS_PRIVATE_CLOUD } from '@/config';
import { Permission } from '@/constants/permissions';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as UI from '@/ducks/ui';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, usePermission, useSelector } from '@/hooks';
import { usePermissionAction } from '@/hooks/permission';
import * as Modals from '@/ModalsV2';
import { WorkspaceItemNameWrapper, WorkspacesDropdown } from '@/pages/Dashboard/Header/components';
import { ClassName } from '@/styles/constants';

const LeftNavSection: React.FC = () => {
  const upgradeModal = Modals.useModal(Modals.Upgrade);

  const plan = useSelector(WorkspaceV2.active.planSelector);
  const name = useSelector(WorkspaceV2.active.nameSelector);
  const workspaces = useSelector(WorkspaceV2.allWorkspacesSelector);
  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const isLoadingProjects = useSelector(UI.isLoadingProjectsSelector);
  const isAdminOrOwnerOfAnyWorkspace = useSelector(WorkspaceV2.isAdminOrOwnerOfAnyWorkspaceSelector);

  const [canCreatePrivateCloudWorkspace] = usePermission(Permission.PRIVATE_CLOUD_WORKSPACE_CREATE);

  const goToWorkspace = useDispatch(Router.goToWorkspace);
  const goToNewWorkspace = useDispatch(Router.goToNewWorkspace);

  const onCreateWorkspace = usePermissionAction(Permission.WORKSPACE_CREATE, {
    onAction: () => goToNewWorkspace(),
    onPlanForbid: ({ planConfig }) => upgradeModal.openVoid(planConfig.upgradeModal()),
  });

  const showCreateWorkspaceButton = !IS_PRIVATE_CLOUD || isAdminOrOwnerOfAnyWorkspace || canCreatePrivateCloudWorkspace;

  return (
    <>
      <Dropdown
        menu={
          <Menu
            maxHeight={600}
            maxVisibleItems={15}
            renderFooterAction={() =>
              showCreateWorkspaceButton ? (
                <Menu.Footer>
                  <Menu.Footer.Action id="createWorkspace" onClick={onCreateWorkspace}>
                    Create New Workspace
                  </Menu.Footer.Action>
                </Menu.Footer>
              ) : null
            }
          >
            {workspaces.map((workspace) => (
              <Menu.Item key={workspace.id} onClick={() => goToWorkspace(workspace.id)}>
                <FlexApart style={{ width: '100%' }}>
                  <WorkspaceItemNameWrapper>{workspace.name}</WorkspaceItemNameWrapper>

                  {workspace.id === activeWorkspaceID && <SvgIcon icon="blocks" color="#becedc" />}
                </FlexApart>
              </Menu.Item>
            ))}
          </Menu>
        }
        placement="bottom-start"
      >
        {({ ref, onToggle }) => (
          <WorkspacesDropdown
            id="workspaceDropdown"
            ref={ref}
            onClick={isLoadingProjects ? Utils.functional.noop : onToggle}
            isLoading={isLoadingProjects}
            className={`${ClassName.DROPDOWN}--active-workspace`}
          >
            <div>{name}</div>

            <SvgIcon icon="caretDown" color="#6e849a" size={9} />
          </WorkspacesDropdown>
        )}
      </Dropdown>

      {!!plan && <PlanBubble plan={plan} />}
    </>
  );
};

export default LeftNavSection;

import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Dropdown, FlexApart, Menu, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import PlanBubble from '@/components/PlanBubble';
import { IS_PRIVATE_CLOUD } from '@/config';
import { Permission } from '@/config/permissions';
import { canAddWorkspace, WorkspacesLimitDetails } from '@/config/planLimits/workspaces';
import { ModalType } from '@/constants';
import * as Router from '@/ducks/router';
import { UpgradePrompt } from '@/ducks/tracking';
import * as UI from '@/ducks/ui';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useModals, usePermission, useSelector, useTrackingEvents } from '@/hooks';
import { WorkspaceItemNameWrapper, WorkspacesDropdown } from '@/pages/Dashboard/Header/components';
import { ClassName } from '@/styles/constants';

interface LeftNavSectionProps {
  activeWorkspace: Realtime.Workspace | null;
}

const LeftNavSection: React.OldFC<LeftNavSectionProps> = ({ activeWorkspace }) => {
  const plan = useSelector(WorkspaceV2.active.planSelector);
  const [canCreatePrivateCloudWorkspace] = usePermission(Permission.CREATE_PRIVATE_CLOUD_WORKSPACE);
  const workspaces = useSelector(WorkspaceV2.allWorkspacesSelector);
  const isAdminOfAnyWorkspace = useSelector(WorkspaceV2.isAdminOfAnyWorkspaceSelector);
  const isLoadingProjects = useSelector(UI.isLoadingProjectsSelector);
  const [trackingEvents] = useTrackingEvents();
  const { open: openUpgradeModal } = useModals(ModalType.UPGRADE_MODAL);

  const goToWorkspace = useDispatch(Router.goToWorkspace);
  const goToNewWorkspace = useDispatch(Router.goToNewWorkspace);

  const privateCloudCreateCondition = isAdminOfAnyWorkspace || canCreatePrivateCloudWorkspace;
  const showCreateWorkspaceButton = !IS_PRIVATE_CLOUD || privateCloudCreateCondition;

  const canAddNewWorkspace = () => {
    if (!canAddWorkspace(plan)) {
      trackingEvents.trackUpgradePrompt({ promptType: UpgradePrompt.WORKSPACE_LIMIT });
      openUpgradeModal({ planLimitDetails: WorkspacesLimitDetails, promptOrigin: UpgradePrompt.WORKSPACE_LIMIT });
    } else {
      goToNewWorkspace();
    }
  };

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
                  <Menu.Footer.Action id="createWorkspace" onClick={canAddNewWorkspace}>
                    Create New Workspace
                  </Menu.Footer.Action>
                </Menu.Footer>
              ) : null
            }
          >
            {workspaces.map((workspace) => {
              const active = workspace.id === activeWorkspace?.id;
              return (
                <Menu.Item key={workspace.id} onClick={() => goToWorkspace(workspace.id)}>
                  <FlexApart style={{ width: '100%' }}>
                    <WorkspaceItemNameWrapper>{workspace.name}</WorkspaceItemNameWrapper>
                    {active && <SvgIcon icon="blocks" color="#becedc" />}
                  </FlexApart>
                </Menu.Item>
              );
            })}
          </Menu>
        }
        placement="bottom-start"
      >
        {(ref, onToggle) => (
          <WorkspacesDropdown
            isLoading={isLoadingProjects}
            id="workspaceDropdown"
            className={`${ClassName.DROPDOWN}--active-workspace`}
            onClick={isLoadingProjects ? Utils.functional.noop : onToggle}
            ref={ref}
          >
            <div>{activeWorkspace?.name}</div>
            <SvgIcon icon="caretDown" color="#6e849a" size={9} />
          </WorkspacesDropdown>
        )}
      </Dropdown>
      <PlanBubble plan={plan!} />
    </>
  );
};

export default LeftNavSection;

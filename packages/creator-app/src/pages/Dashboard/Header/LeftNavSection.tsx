import { UserRole } from '@voiceflow/internal';
import { Dropdown, FlexApart, Menu, MenuItem, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import PlanBubble from '@/components/PlanBubble';
import { IS_PRIVATE_CLOUD } from '@/config';
import { FeatureFlag } from '@/config/features';
import * as Account from '@/ducks/account';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as WorkspaceDuck from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useFeature, useIsTemplateWorkspaceSelector, useSelector, useWorkspaceUserRoleSelector } from '@/hooks';
import { Workspace } from '@/models';
import { WorkspaceItemNameWrapper, WorkspacesDropdown } from '@/pages/Dashboard/Header/components';
import { ClassName } from '@/styles/constants';
import { noop } from '@/utils/functional';

interface LeftNavSectionProps {
  loadingProjects: boolean;
  activeWorkspace: Workspace | null;
}

const LeftNavSection: React.FC<LeftNavSectionProps> = ({ activeWorkspace, loadingProjects }) => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const userID = useSelector(Account.userIDSelector);
  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);

  const planV1 = useSelector(WorkspaceDuck.planTypeSelector);
  const planRealtime = useSelector((state) => WorkspaceV2.workspacePlanTypeByIDSelector(state, { id: activeWorkspaceID }));
  const role = useWorkspaceUserRoleSelector();
  const workspacesV1 = useSelector(WorkspaceDuck.allWorkspacesSelector);
  const workspacesRealtime = useSelector(WorkspaceV2.allWorkspacesSelector);
  const isTemplateWorkspace = useIsTemplateWorkspaceSelector();
  const isAdminOfAnyWorkspaceV1 = useSelector(WorkspaceDuck.isAdminOfAnyWorkspaceSelector);
  const isAdminOfAnyWorkspaceRealtime = useSelector((state) => WorkspaceV2.isCreatorAdminOfAnyWorkspaceSelector(state, { creatorID: userID! }));

  const plan = atomicActions.isEnabled ? planRealtime : planV1;
  const workspaces = atomicActions.isEnabled ? workspacesRealtime : workspacesV1;
  const isAdminOfAnyWorkspace = atomicActions.isEnabled ? isAdminOfAnyWorkspaceRealtime : isAdminOfAnyWorkspaceV1;

  const goToWorkspace = useDispatch(Router.goToWorkspace);
  const goToNewWorkspace = useDispatch(Router.goToNewWorkspace);

  const privateCloudCreateCondition = isAdminOfAnyWorkspace || role === UserRole.OWNER;
  const showCreateWorkspaceButton = !IS_PRIVATE_CLOUD || privateCloudCreateCondition;

  return (
    <>
      <Dropdown
        menu={
          <Menu maxHeight={600} maxVisibleItems={15}>
            <>
              {workspaces.map((workspace) => {
                const active = workspace.id === activeWorkspace?.id;
                return (
                  <MenuItem key={workspace.id} onClick={() => goToWorkspace(workspace.id)}>
                    <FlexApart style={{ width: '100%' }}>
                      <WorkspaceItemNameWrapper>{workspace.name}</WorkspaceItemNameWrapper>
                      {active && <SvgIcon icon="blocks" color="#becedc" />}
                    </FlexApart>
                  </MenuItem>
                );
              })}
              {showCreateWorkspaceButton && (
                <>
                  <MenuItem divider />
                  <MenuItem onClick={() => goToNewWorkspace()} bottomAction id="createWorkspace">
                    Create New Workspace
                  </MenuItem>
                </>
              )}
            </>
          </Menu>
        }
        placement="bottom-start"
      >
        {(ref, onToggle) => (
          <WorkspacesDropdown
            isLoading={loadingProjects}
            id="workspaceDropdown"
            className={`${ClassName.DROPDOWN}--active-workspace`}
            onClick={loadingProjects ? noop : onToggle}
            ref={ref}
          >
            <div>{activeWorkspace?.name}</div>
            <SvgIcon icon="caretDown" color="#6e849a" size={9} />
          </WorkspacesDropdown>
        )}
      </Dropdown>
      {!isTemplateWorkspace && <PlanBubble plan={plan!} />}
    </>
  );
};

export default LeftNavSection;

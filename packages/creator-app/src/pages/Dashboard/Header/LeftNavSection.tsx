import { Dropdown, FlexApart, Menu, MenuItem, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import PlanBubble from '@/components/PlanBubble';
import { IS_PRIVATE_CLOUD } from '@/config';
import { Permission } from '@/config/permissions';
import * as Router from '@/ducks/router';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, usePermission, useSelector } from '@/hooks';
import { Workspace } from '@/models';
import { WorkspaceItemNameWrapper, WorkspacesDropdown } from '@/pages/Dashboard/Header/components';
import { ClassName } from '@/styles/constants';
import { noop } from '@/utils/functional';

interface LeftNavSectionProps {
  loadingProjects: boolean;
  activeWorkspace: Workspace | null;
}

const LeftNavSection: React.FC<LeftNavSectionProps> = ({ activeWorkspace, loadingProjects }) => {
  const plan = useSelector(WorkspaceV2.active.planSelector);
  const [canCreatePrivateCloudWorkspace] = usePermission(Permission.CREATE_PRIVATE_CLOUD_WORKSPACE);
  const workspaces = useSelector(WorkspaceV2.allWorkspacesSelector);
  const isTemplateWorkspace = useSelector(WorkspaceV2.active.isTemplatesSelector);
  const isAdminOfAnyWorkspace = useSelector(WorkspaceV2.isAdminOfAnyWorkspaceSelector);

  const goToWorkspace = useDispatch(Router.goToWorkspace);
  const goToNewWorkspace = useDispatch(Router.goToNewWorkspace);

  const privateCloudCreateCondition = isAdminOfAnyWorkspace || canCreatePrivateCloudWorkspace;
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

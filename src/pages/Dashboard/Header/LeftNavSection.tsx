import React from 'react';

import Dropdown from '@/components/Dropdown';
import { FlexApart } from '@/components/Flex';
import Menu, { MenuItem } from '@/components/Menu';
import PlanBubble from '@/components/PlanBubble';
import SvgIcon from '@/components/SvgIcon';
import { IS_PRIVATE_CLOUD } from '@/config';
import * as Router from '@/ducks/router';
import * as WorkspaceDuck from '@/ducks/workspace';
import { connect } from '@/hocs';
import { Workspace } from '@/models';
import { WorkspaceItemNameWrapper, WorkspacesDropdown } from '@/pages/Dashboard/Header/components';
import { ClassName } from '@/styles/constants';
import { ConnectedProps } from '@/types';
import { noop } from '@/utils/functional';

type LeftNavSectionProps = {
  loadingProjects: boolean;
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
};

const LeftNavSection: React.FC<LeftNavSectionProps & ConnectedLeftNavSectionProps> = ({
  workspaces,
  activeWorkspace,
  isTemplateWorkspace,
  loadingProjects,
  goToWorkspace,
  isAdminOfAnyWorkspace,
  goTo,
  plan,
}) => {
  const showCreateWorkspaceButton = !IS_PRIVATE_CLOUD || isAdminOfAnyWorkspace;

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
                  <MenuItem onClick={() => goTo('workspace/new')} bottomAction id="createWorkspace">
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

const mapStateToProps = {
  plan: WorkspaceDuck.planTypeSelector,
  isTemplateWorkspace: WorkspaceDuck.isTemplateWorkspaceSelector,
  isAdminOfAnyWorkspace: WorkspaceDuck.isAdminOfAnyWorkspaceSelector,
};

const mapDispatchToProps = {
  goToWorkspace: Router.goToWorkspace,
  goTo: Router.goTo,
};

type ConnectedLeftNavSectionProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(LeftNavSection) as React.FC<LeftNavSectionProps>;

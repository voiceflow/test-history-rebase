import React from 'react';

import Dropdown from '@/components/Dropdown';
import { FlexApart } from '@/components/Flex';
import Menu, { MenuItem } from '@/components/Menu';
import PlanBubble from '@/components/PlanBubble';
import SvgIcon from '@/components/SvgIcon';
import * as Router from '@/ducks/router';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { WorkspaceItemNameWrapper, WorkspacesDropdown } from '@/pages/Dashboard/Header/components';
import { ClassName } from '@/styles/constants';
import { ConnectedProps } from '@/types';
import { noop } from '@/utils/functional';

type LeftNavSectionProps = {
  loadingProjects: boolean;
  workspaces: { templates: boolean; id: string; name: string }[];
  activeWorkspace: {
    name: string;
    id: string;
  };
};

const LeftNavSection: React.FC<LeftNavSectionProps & ConnectedLeftNavSectionProps> = ({
  workspaces,
  activeWorkspace,
  isTemplateWorkspace,
  loadingProjects,
  goToWorkspace,
  goTo,
  plan,
}) => {
  return (
    <>
      <Dropdown
        menu={
          <Menu maxHeight={600} maxVisibleItems={15}>
            <>
              {workspaces.map((workspace) => {
                const active = workspace.id === activeWorkspace.id;
                return (
                  <MenuItem key={workspace.id} onClick={() => goToWorkspace(workspace.id)}>
                    <FlexApart style={{ width: '100%' }}>
                      <WorkspaceItemNameWrapper>{workspace.name}</WorkspaceItemNameWrapper>
                      {active && <SvgIcon icon="blocks" color="#becedc" />}
                    </FlexApart>
                  </MenuItem>
                );
              })}

              <MenuItem divider />
              <MenuItem onClick={() => goTo('workspace/new')} bottomAction id="createWorkspace">
                Create New Workspace
              </MenuItem>
            </>
          </Menu>
        }
        placement="bottom-start"
      >
        {(ref, onToggle) => (
          <WorkspacesDropdown
            loading={loadingProjects}
            id="workspaceDropdown"
            className={`${ClassName.DROPDOWN}--active-workspace`}
            onClick={loadingProjects ? noop : onToggle}
            ref={ref}
          >
            <div>{activeWorkspace.name}</div>
            <SvgIcon icon="caretDown" color="#6e849a" size={9} />
          </WorkspacesDropdown>
        )}
      </Dropdown>
      {!isTemplateWorkspace && <PlanBubble plan={plan!} />}
    </>
  );
};

const mapStateToProps = {
  plan: Workspace.planTypeSelector,
  isTemplateWorkspace: Workspace.isTemplateWorkspaceSelector,
};

const mapDispatchToProps = {
  goToWorkspace: Router.goToWorkspace,
  goTo: Router.goTo,
};

type ConnectedLeftNavSectionProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(LeftNavSection);

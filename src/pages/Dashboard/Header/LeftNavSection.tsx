import React from 'react';

import BubbleText from '@/components/BubbleText';
import Dropdown from '@/components/Dropdown';
import { FlexApart } from '@/components/Flex';
import Menu, { MenuItem } from '@/components/Menu';
import SvgIcon from '@/components/SvgIcon';
import { FeatureFlag } from '@/config/features';
import { PLAN_TYPE_META, PlanType, WORKSPACES_LIMIT } from '@/constants';
import * as Router from '@/ducks/router';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import { WorkspaceItemNameWrapper, WorkspacesDropdown } from '@/pages/Dashboard/Header/components';
import { ClassName } from '@/styles/constants';
import { ConnectedProps } from '@/types';

type LeftNavSectionProps = {
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
  goToWorkspace,
  goTo,
  plan,
}) => {
  const templatesFeature = useFeature(FeatureFlag.TEMPLATES);
  const workspaceCreationFeature = useFeature(FeatureFlag.WORKSPACE_CREATION_FLOW);
  const workspacesWithoutTemplates = workspaces.filter((workspace) => !workspace.templates);
  const filteredWorkspaces = templatesFeature.isEnabled ? workspaces : workspacesWithoutTemplates;

  return (
    <>
      <Dropdown
        menu={
          <Menu maxHeight={600} maxVisibleItems={15}>
            <>
              {filteredWorkspaces.map((workspace) => {
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
              {(workspaceCreationFeature.isEnabled || filteredWorkspaces.length < WORKSPACES_LIMIT) && (
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
          <WorkspacesDropdown id="workspaceDropdown" className={`${ClassName.DROPDOWN}--active-workspace`} onClick={onToggle} ref={ref}>
            <div>{activeWorkspace.name}</div>
            <SvgIcon icon="caretDown" color="#6e849a" size={9} />
          </WorkspacesDropdown>
        )}
      </Dropdown>
      {!isTemplateWorkspace && (
        <BubbleText color={PLAN_TYPE_META[plan!].color}>
          {/* This is the only place we want to show 'Free' */}
          {plan === PlanType.STARTER || plan === PlanType.OLD_STARTER ? 'Free' : PLAN_TYPE_META[plan!].label}
        </BubbleText>
      )}
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

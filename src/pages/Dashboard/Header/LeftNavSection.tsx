import React from 'react';

import BubbleText from '@/components/BubbleText';
import Dropdown from '@/components/Dropdown';
import { FlexApart } from '@/components/Flex';
import Menu, { MenuItem } from '@/components/Menu';
import SvgIcon from '@/components/SvgIcon';
import { FeatureFlag } from '@/config/features';
import { PLAN_NAMES, PlanType, WORKSPACES_LIMIT } from '@/constants';
import * as Router from '@/ducks/router';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import { WorkspaceItemNameWrapper, WorkspacesDropdown } from '@/pages/Dashboard/Header/components';
import { ConnectedProps } from '@/types';

const DropdownComponent: any = Dropdown;
const MenuComponent: any = Menu;
const MenuItemComponent: any = MenuItem;

type LeftNavSectionProps = {
  workspaces: { templates: boolean; id: string; name: string }[];
  activeWorkspace: {
    name: string;
    id: string;
  };
};

const LeftNavSection: React.FC<LeftNavSectionProps & ConnectedLeftNavSectionProps> = ({ workspaces, activeWorkspace, goToWorkspace, goTo, plan }) => {
  const templatesFeature = useFeature(FeatureFlag.TEMPLATES);
  const workspacesWithoutTemplates = workspaces.filter((workspace) => !workspace.templates);
  const filteredWorkspaces = templatesFeature.isEnabled ? workspaces : workspacesWithoutTemplates;

  return (
    <>
      <DropdownComponent
        menu={
          <MenuComponent>
            <>
              {filteredWorkspaces.map((workspace) => {
                const active = workspace.id === activeWorkspace.id;
                return (
                  <MenuItemComponent
                    key={workspace.id}
                    onClick={() => {
                      goToWorkspace(workspace.id);
                    }}
                  >
                    <FlexApart style={{ width: '100%' }}>
                      <WorkspaceItemNameWrapper>{workspace.name}</WorkspaceItemNameWrapper>
                      {active && <SvgIcon icon="blocks" color="#becedc" />}
                    </FlexApart>
                  </MenuItemComponent>
                );
              })}
              {filteredWorkspaces.length < WORKSPACES_LIMIT && (
                <>
                  <MenuItemComponent divider />
                  <MenuItemComponent
                    onClick={() => {
                      goTo('workspace/new');
                    }}
                    bottomAction
                  >
                    Create New Workspace
                  </MenuItemComponent>
                </>
              )}
            </>
          </MenuComponent>
        }
        placement="bottom-start"
      >
        {(ref: React.Ref<any>, onToggle: () => void) => (
          <WorkspacesDropdown onClick={onToggle} ref={ref}>
            <div>{activeWorkspace.name}</div>
            <SvgIcon icon="caretDown" color="#6e849a" size={9} />
          </WorkspacesDropdown>
        )}
      </DropdownComponent>
      {/* This is the only place we want to show 'Free' */}
      <BubbleText color={PLAN_NAMES[plan!].color}>
        {plan === PlanType.STARTER || plan === PlanType.OLD_STARTER ? 'Free' : PLAN_NAMES[plan!].label}
      </BubbleText>
    </>
  );
};

const mapStateToProps = {
  plan: Workspace.planTypeSelector,
};

const mapDispatchToProps = {
  goToWorkspace: Router.goToWorkspace,
  goTo: Router.goTo,
};

type ConnectedLeftNavSectionProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(LeftNavSection);

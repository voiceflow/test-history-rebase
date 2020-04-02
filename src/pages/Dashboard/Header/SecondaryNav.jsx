import React from 'react';
import { Link } from 'react-router-dom';

import Dropdown from '@/components/Dropdown';
import FlexCenter from '@/components/Flex';
import Menu, { MenuItem } from '@/components/Menu';
import SvgIcon from '@/components/SvgIcon';
import Tabs from '@/components/Tabs';
import { Members } from '@/components/User';
import { FEATURE_IDS, ModalType, PLANS } from '@/constants';
import { usePermissions } from '@/contexts/RolePermissionsContext';
import { leaveWorkspace, planTypeSelector } from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useModals } from '@/hooks';

import { AddCollaborators, ButtonSquare, NavChildItem, NewWorkspaceTab, TabsContainer } from './components';

const SafeLink = ({ isActive, ...props }) => <Link {...props} />;

function SecondaryNav({ leaveWorkspace, workspaces, workspaceID: selectedWorkspaceID, workspace: selectedWorkspace, fetchBoards, plan }) {
  const { toggle: togglePayment } = useModals(ModalType.PAYMENT);
  const { toggle: toggleCollaborators } = useModals(ModalType.COLLABORATORS);
  const { toggle: toggleWorkspaceSettings } = useModals(ModalType.BOARD_SETTINGS);
  const [canUseWorkspaceSettings] = usePermissions(FEATURE_IDS.WORKSPACE_SETTINGS);
  const [canAddCollaborators] = usePermissions(FEATURE_IDS.ADD_COLLABORATORS);

  const tabsOptions = React.useMemo(() => {
    const tabs = workspaces.map((workspace) => ({
      to: `/workspace/${workspace.id}`,
      value: workspace.id,
      label: workspace.name,
    }));

    if (workspaces.length < 3) {
      tabs.push({
        to: '/workspace/new',
        value: '/workspace/new',
        label: <NewWorkspaceTab>New Workspace</NewWorkspaceTab>,
      });
    }

    return tabs;
  }, [workspaces]);

  return (
    <>
      <TabsContainer>
        <Tabs as={SafeLink} options={tabsOptions} onChange={() => fetchBoards && fetchBoards.abort()} selected={selectedWorkspaceID} innerRef />
      </TabsContainer>

      <FlexCenter>
        {selectedWorkspace && (
          <>
            {selectedWorkspace.members.length > 1 ? (
              <Members members={selectedWorkspace.members} onAdd={canAddCollaborators && (() => toggleCollaborators())} />
            ) : (
              canAddCollaborators && (
                <AddCollaborators onClick={toggleCollaborators}>
                  <SvgIcon icon="power" color="inherit" />
                  Add Collaborators
                </AddCollaborators>
              )
            )}

            <>
              {
                <NavChildItem>
                  <Dropdown
                    menu={
                      <Menu>
                        {canUseWorkspaceSettings ? (
                          <>
                            <MenuItem onClick={toggleCollaborators}>Collaborators</MenuItem>
                            <MenuItem onClick={toggleWorkspaceSettings}>Workspace Settings</MenuItem>
                            {selectedWorkspace.plan !== PLANS.enterprise && <MenuItem onClick={togglePayment}>Payment</MenuItem>}
                            <MenuItem divider />
                            {plan ? (
                              <MenuItem disabled capitalize>
                                {plan} Plan
                              </MenuItem>
                            ) : (
                              <MenuItem onClick={togglePayment} style={{ color: '#279745' }}>
                                Upgrade Workspace
                              </MenuItem>
                            )}
                          </>
                        ) : (
                          <MenuItem onClick={leaveWorkspace}>Leave Workspace</MenuItem>
                        )}
                      </Menu>
                    }
                    placement="bottom-end"
                  >
                    {(ref, onToggle) => (
                      <ButtonSquare onClick={onToggle} ref={ref}>
                        <SvgIcon icon="cog" />
                      </ButtonSquare>
                    )}
                  </Dropdown>
                </NavChildItem>
              }
            </>
          </>
        )}
      </FlexCenter>
    </>
  );
}

const mapStateToProps = {
  plan: planTypeSelector,
};

const mapDispatchToProps = {
  leaveWorkspace,
};

export default connect(mapStateToProps, mapDispatchToProps)(SecondaryNav);

import React from 'react';
import { Link } from 'react-router-dom';

import SvgIcon from '@/components/SvgIcon';
import { Members } from '@/components/User';
import Dropdown from '@/componentsV2/Dropdown';
import Menu, { MenuItem } from '@/componentsV2/Menu';
import Tabs from '@/componentsV2/Tabs';
import { FEATURE_IDS, MODALS, PLANS } from '@/constants';
import { useModals } from '@/contexts/ModalsContext';
import { usePermissions } from '@/contexts/RolePermissionsContext';
import { leaveWorkspace, planTypeSelector } from '@/ducks/workspace';
import { connect } from '@/hocs';

import { NewWorkspaceTab, TabsContainer } from './components';

const SafeLink = ({ isActive, ...props }) => <Link {...props} />;

function SecondaryNav({ leaveWorkspace, workspaces, workspaceID: selectedWorkspaceID, workspace: selectedWorkspace, fetchBoards, plan }) {
  const { toggle: togglePayment } = useModals(MODALS.PAYMENT);
  const { toggle: toggleCollaborators } = useModals(MODALS.COLLABORATORS);
  const { toggle: toggleWorkspaceSettings } = useModals(MODALS.BOARD_SETTINGS);
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
        label: (
          <NewWorkspaceTab>
            <SvgIcon icon="addBoard" color="inherit" /> New Workspace
          </NewWorkspaceTab>
        ),
      });
    }

    return tabs;
  }, [workspaces]);

  return (
    <div id="secondary-nav">
      <TabsContainer>
        <Tabs as={SafeLink} options={tabsOptions} onChange={() => fetchBoards && fetchBoards.abort()} selected={selectedWorkspaceID} innerRef />
      </TabsContainer>

      <div className="super-center">
        {selectedWorkspace && (
          <>
            {selectedWorkspace.members.length > 1 ? (
              <Members members={selectedWorkspace.members} onAdd={canAddCollaborators && (() => toggleCollaborators())} />
            ) : (
              canAddCollaborators && (
                <div className="add-collaborators" onClick={toggleCollaborators}>
                  <SvgIcon icon="power" color="inherit" />
                  Add Collaborators
                </div>
              )
            )}

            <>
              {
                <div className="nav-child-item">
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
                      <div className="pointer btn-square" onClick={onToggle} ref={ref}>
                        <SvgIcon icon="cog" />
                      </div>
                    )}
                  </Dropdown>
                </div>
              }
            </>
          </>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = {
  plan: planTypeSelector,
};

const mapDispatchToProps = {
  leaveWorkspace,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SecondaryNav);

import React from 'react';
import { Link } from 'react-router-dom';

import SvgIcon from '@/components/SvgIcon';
import { Members } from '@/components/User/User';
import Dropdown from '@/componentsV2/Dropdown';
import Tabs from '@/componentsV2/Tabs';
import { FEATURE_IDS, MODALS } from '@/constants';
import { useModals } from '@/contexts/ModalsContext';
import { usePermissions } from '@/contexts/RolePermissionsContext';
import { leaveWorkspace } from '@/ducks/workspace';
import RolePermissionGate from '@/gates/RolePermissionGate';
import { connect } from '@/hocs';

import { NewWorkspaceTab, TabsContainer } from './components';

const SafeLink = ({ isActive, ...props }) => <Link {...props} />;

function SecondaryNav({ leaveWorkspace, workspaces, workspaceID: selectedWorkspaceID, workspace: selectedWorkspace, fetchBoards }) {
  const { toggle: togglePayment } = useModals(MODALS.PAYMENT);
  const { toggle: toggleCollaborators } = useModals(MODALS.COLLABORATORS);
  const { toggle: toggleWorkspaceSettings } = useModals(MODALS.BOARD_SETTINGS);
  const [canUseWorkspaceSettings] = usePermissions(FEATURE_IDS.WORKSPACE_SETTINGS);
  const options = React.useMemo(
    () =>
      canUseWorkspaceSettings
        ? [
            {
              label: 'Workspace Settings',
              onClick: toggleWorkspaceSettings,
            },
            {
              label: 'Payment',
              onClick: togglePayment,
            },
          ]
        : [
            {
              label: 'Leave Workspace',
              onClick: async () => {
                await leaveWorkspace();
              },
            },
          ],
    [canUseWorkspaceSettings]
  );

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
            <RolePermissionGate featureId={FEATURE_IDS.ADD_COLLABORATORS}>
              <div className="add-collaborators" onClick={toggleCollaborators}>
                <SvgIcon icon="power" color="inherit" />
                Add Collaborators
              </div>
            </RolePermissionGate>

            <Members members={selectedWorkspace.members} />
            <>
              {!!options.length && (
                <div className="nav-child-item">
                  <Dropdown options={options} placement="bottom-end">
                    {(ref, onToggle) => (
                      <div className="pointer btn-square" onClick={onToggle} ref={ref}>
                        <SvgIcon icon="cog" />
                      </div>
                    )}
                  </Dropdown>
                </div>
              )}
            </>
          </>
        )}
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  leaveWorkspace,
};

export default connect(
  null,
  mapDispatchToProps
)(SecondaryNav);

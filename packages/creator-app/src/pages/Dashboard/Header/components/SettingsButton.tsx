import { UserRole } from '@voiceflow/internal';
import { ClickableText, Dropdown, IconButton, IconButtonVariant, Menu, MenuItem, Text, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import { ModalType, PLAN_TYPE_META } from '@/constants';
import * as Router from '@/ducks/router';
import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useModals, usePermission, useSelector } from '@/hooks';

const SettingsButton: React.FC = () => {
  const plan = useSelector(WorkspaceV2.active.planSelector);
  const isOnPaidPlan = useSelector(WorkspaceV2.active.isOnPaidPlanSelector);

  const leaveWorkspace = useDispatch(Workspace.leaveActiveWorkspace);
  const goToWorkspaceSettings = useDispatch(Router.goToCurrentWorkspaceSettings);

  const { toggle: togglePayment, open: openUpgrade } = useModals(ModalType.PAYMENT);
  const { toggle: toggleCollaborators } = useModals(ModalType.COLLABORATORS);
  const [canConfigureWorkspace, { activeRole }] = usePermission(Permission.CONFIGURE_WORKSPACE);

  const isEditor = activeRole === UserRole.EDITOR;
  const isLibrary = activeRole === UserRole.LIBRARY;
  const isViewer = isLibrary || activeRole === UserRole.VIEWER;

  return (
    <TippyTooltip title="Settings" position="bottom">
      <Dropdown
        menu={
          <Menu noBottomPadding noTopPadding={!canConfigureWorkspace && isLibrary}>
            {canConfigureWorkspace ? (
              <>
                <MenuItem onClick={toggleCollaborators}>Manage Collaborators</MenuItem>
                <MenuItem onClick={goToWorkspaceSettings}>Workspace Settings</MenuItem>
                <MenuItem divider style={{ marginBottom: 0 }} />
                {plan ? (
                  <MenuItem disabled capitalize ending>
                    <Text color="#62778c">{PLAN_TYPE_META[plan].label} Plan &nbsp;-&nbsp; </Text>

                    <ClickableText onClick={openUpgrade}>{isOnPaidPlan ? <span>Manage</span> : <span>Upgrade</span>}</ClickableText>
                  </MenuItem>
                ) : (
                  <MenuItem onClick={togglePayment} style={{ color: '#279745' }}>
                    Upgrade Workspace
                  </MenuItem>
                )}
              </>
            ) : (
              <>
                {!isLibrary && <MenuItem onClick={leaveWorkspace}>Leave Workspace</MenuItem>}

                {(isEditor || isViewer) && (
                  <>
                    {!isLibrary && <MenuItem divider style={{ marginBottom: 0 }} />}

                    <MenuItem disabled ending>
                      <Text color="#62778c">Workspace {isEditor ? 'Editor' : 'Viewer'}</Text>
                    </MenuItem>
                  </>
                )}
              </>
            )}
          </Menu>
        }
        placement="bottom-end"
      >
        {(ref, onToggle, isOpen) => (
          <IconButton
            ref={ref}
            variant={IconButtonVariant.OUTLINE}
            active={isOpen}
            icon="cog"
            onClick={() => {
              onToggle();
            }}
            iconProps={{ width: 16, height: 15 }}
            large
          />
        )}
      </Dropdown>
    </TippyTooltip>
  );
};

export default SettingsButton;

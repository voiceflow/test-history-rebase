import { UserRole } from '@voiceflow/internal';
import { ClickableText, Dropdown, IconButton, IconButtonVariant, Menu, Text, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { ModalType, PLAN_TYPE_META } from '@/constants';
import { Permission } from '@/constants/permissions';
import * as Router from '@/ducks/router';
import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useModals, usePermission, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

const SettingsButton: React.OldFC = () => {
  const plan = useSelector(WorkspaceV2.active.planSelector);
  const isOnPaidPlan = useSelector(WorkspaceV2.active.isOnPaidPlanSelector);

  const leaveWorkspace = useDispatch(Workspace.leaveActiveWorkspace);
  const goToWorkspaceSettings = useDispatch(Router.goToCurrentWorkspaceSettings);

  const { toggle: togglePayment, open: openUpgrade } = useModals(ModalType.PAYMENT);
  const collaboratorsModal = ModalsV2.useModal(ModalsV2.Collaborators);
  const [canViewSettingsWorkspace, { activeRole }] = usePermission(Permission.VIEW_SETTINGS_WORKSPACE);
  const [canNotLeaveWorkspace] = usePermission(Permission.UNABLE_TO_LEAVE_WORKSPACE);

  const isEditor = activeRole === UserRole.EDITOR;
  const isViewer = activeRole === UserRole.VIEWER;

  return (
    <TippyTooltip content="Settings" position="bottom">
      <Dropdown
        menu={
          <Menu noBottomPadding>
            {canViewSettingsWorkspace && (
              <>
                <Menu.Item onClick={() => collaboratorsModal.openVoid()}>Manage Collaborators</Menu.Item>
                <Menu.Item onClick={goToWorkspaceSettings}>Workspace Settings</Menu.Item>
                <Menu.Item divider style={{ marginBottom: 0 }} />
              </>
            )}
            {!canNotLeaveWorkspace && (
              <>
                <Menu.Item onClick={leaveWorkspace}>Leave Workspace</Menu.Item>
                <Menu.Item divider style={{ marginBottom: 0 }} />
              </>
            )}

            {canViewSettingsWorkspace ? (
              <>
                {plan ? (
                  <Menu.Item disabled capitalize ending>
                    <Text color="#62778c">{PLAN_TYPE_META[plan].label} Plan &nbsp;-&nbsp; </Text>

                    <ClickableText onClick={openUpgrade}>{isOnPaidPlan ? <span>Manage</span> : <span>Upgrade</span>}</ClickableText>
                  </Menu.Item>
                ) : (
                  <Menu.Item onClick={togglePayment} style={{ color: '#279745' }}>
                    Upgrade Workspace
                  </Menu.Item>
                )}
              </>
            ) : (
              <>
                {(isEditor || isViewer) && (
                  <Menu.Item disabled ending>
                    <Text color="#62778c">Workspace {isEditor ? 'Editor' : 'Viewer'}</Text>
                  </Menu.Item>
                )}
              </>
            )}
          </Menu>
        }
        placement="bottom-end"
      >
        {({ ref, onToggle, isOpen }) => (
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

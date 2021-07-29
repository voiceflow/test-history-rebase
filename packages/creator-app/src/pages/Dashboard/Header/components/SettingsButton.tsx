import { PlanType, UserRole } from '@voiceflow/internal';
import { ClickableText, Dropdown, IconButton, IconButtonVariant, Menu, MenuItem, Text, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { FeatureFlag } from '@/config/features';
import { Permission } from '@/config/permissions';
import { ModalType, PLAN_TYPE_META } from '@/constants';
import * as RealtimeWorkspace from '@/ducks/realtimeV2/workspace';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';
import { useDispatch, useFeature, useModals, usePermission, useRealtimeSelector, useSelector } from '@/hooks';

const SettingsButton: React.FC = () => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const planV1 = useSelector(Workspace.planTypeSelector);
  const planRealtime = useRealtimeSelector((state) => RealtimeWorkspace.workspacePlanTypeByIDSelector(state, { id: activeWorkspaceID }));

  const plan = atomicActions.isEnabled ? planRealtime : planV1;

  const leaveWorkspace = useDispatch(Workspace.leaveActiveWorkspace);
  const goToWorkspaceSettings = useDispatch(Router.goToCurrentWorkspaceSettings);

  const { toggle: togglePayment } = useModals(ModalType.PAYMENT);
  const { toggle: toggleCollaborators } = useModals(ModalType.COLLABORATORS);
  const [canConfigureWorkspace, { activeRole }] = usePermission(Permission.CONFIGURE_WORKSPACE);
  const { open: openUpgrade } = useModals(ModalType.PAYMENT);

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

                    <ClickableText onClick={openUpgrade}>
                      {plan === PlanType.STARTER || plan === PlanType.OLD_STARTER ? <span>Upgrade</span> : <span>Manage</span>}
                    </ClickableText>
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

import React from 'react';

import Dropdown from '@/components/Dropdown';
import IconButton, { IconButtonVariant } from '@/components/IconButton';
import Menu, { MenuItem } from '@/components/Menu';
import { ClickableText, Text } from '@/components/Text';
import TippyTooltip from '@/components/TippyTooltip';
import { Permission } from '@/config/permissions';
import { ModalType, PLAN_TYPE_META, PlanType, UserRole } from '@/constants';
import * as Router from '@/ducks/router';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useModals, usePermission } from '@/hooks';
import { ConnectedProps } from '@/types';

const SettingsButton: React.FC<ConnectedSettingsButton> = ({ plan, goToWorkspaceSettings, leaveWorkspace }) => {
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

const mapStateToProps = {
  plan: Workspace.planTypeSelector,
};

const mapDispatchToProps = {
  leaveWorkspace: Workspace.leaveWorkspace,
  goToWorkspaceSettings: Router.goToCurrentWorkspaceSettings,
};

type ConnectedSettingsButton = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(SettingsButton);

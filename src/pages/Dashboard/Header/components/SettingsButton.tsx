import React from 'react';

import Dropdown from '@/components/Dropdown';
import IconButton, { IconButtonVariant } from '@/components/IconButton';
import Menu, { MenuItem } from '@/components/Menu';
import ClickableText from '@/components/Text/components/ClickableText';
import TippyTooltip from '@/components/TippyTooltip';
import { Permission } from '@/config/permissions';
import { ModalType, PLAN_TYPE_META, PlanType, UserRole } from '@/constants';
import { leaveWorkspace, planTypeSelector } from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useModals, usePermission } from '@/hooks';
import { ConnectedProps } from '@/types';

const SettingsButton: React.FC<ConnectedSettingsButton> = ({ plan, leaveWorkspace }) => {
  const { toggle: togglePayment } = useModals(ModalType.PAYMENT);
  const { toggle: toggleCollaborators } = useModals(ModalType.COLLABORATORS);
  const { toggle: toggleWorkspaceSettings } = useModals(ModalType.BOARD_SETTINGS);
  const [canConfigureWorkspace, { activeRole }] = usePermission(Permission.CONFIGURE_WORKSPACE);
  const { open: openUpgrade } = useModals(ModalType.PAYMENT);

  const isEditor = activeRole === UserRole.EDITOR;
  const isViewer = activeRole === UserRole.VIEWER || activeRole === UserRole.LIBRARY;

  return (
    <TippyTooltip title="Settings" position="bottom">
      <Dropdown
        menu={
          <Menu noBottomPadding>
            {canConfigureWorkspace ? (
              <>
                <MenuItem onClick={toggleCollaborators}>Manage Collaborators</MenuItem>
                <MenuItem onClick={toggleWorkspaceSettings}>Workspace Settings</MenuItem>
                <MenuItem divider />
                {plan ? (
                  <MenuItem disabled capitalize teamItem>
                    {PLAN_TYPE_META[plan].label} Plan
                    <>
                      &nbsp;-&nbsp;{' '}
                      <ClickableText onClick={openUpgrade}>
                        {plan === PlanType.STARTER || plan === PlanType.OLD_STARTER ? <span>Upgrade</span> : <span>Manage</span>}
                      </ClickableText>
                    </>
                  </MenuItem>
                ) : (
                  <MenuItem onClick={togglePayment} style={{ color: '#279745' }}>
                    Upgrade Workspace
                  </MenuItem>
                )}
              </>
            ) : (
              <>
                <MenuItem onClick={leaveWorkspace}>Leave Workspace</MenuItem>
                {(isEditor || isViewer) && (
                  <>
                    <MenuItem divider />
                    <MenuItem disabled teamItem>
                      Workspace {isEditor ? 'Editor' : 'Viewer'}
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
  plan: planTypeSelector,
};

const mapDispatchToProps = {
  leaveWorkspace,
};

type ConnectedSettingsButton = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(SettingsButton);

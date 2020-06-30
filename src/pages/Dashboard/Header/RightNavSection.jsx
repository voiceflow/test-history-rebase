import React from 'react';

import Dropdown from '@/components/Dropdown';
import IconButton from '@/components/IconButton';
import Menu, { MenuItem } from '@/components/Menu';
import SvgIcon from '@/components/SvgIcon';
import ClickableText from '@/components/Text/components/ClickableText';
import { Permission } from '@/config/permissions';
import { ModalType, PLAN_NAMES, PlanType, UserRole } from '@/constants';
import { notificationsSelector, readNotifications } from '@/ducks/notifications';
import { leaveWorkspace, planTypeSelector } from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useModals, usePermission } from '@/hooks';
import { useToggle } from '@/hooks/toggle';
import ResourcesHeaderButton from '@/pages/Dashboard/Header/components/ResourcesHeaderButton';
import { stopPropagation } from '@/utils/dom';

import UpdatesPopover from '../UpdatesPopover';
import { Numbered, SubHeaderItem, UpdateBubble } from './components';

const DEFAULT_MESSAGE = [
  {
    details: 'There are no new updates available.',
    type: 'empty',
    created: 0,
  },
];

function RightNavSection({ notifications, readNotifications, plan, leaveWorkspace }) {
  const [onHover, toggleUpdatesHover] = useToggle(false);
  const newNotifications = React.useMemo(() => notifications.filter(({ isNew }) => isNew), [notifications]);
  const { toggle: togglePayment } = useModals(ModalType.PAYMENT);
  const { toggle: toggleCollaborators } = useModals(ModalType.COLLABORATORS);
  const { toggle: toggleWorkspaceSettings } = useModals(ModalType.BOARD_SETTINGS);
  const [canUseWorkspaceSettings, { activeRole }] = usePermission(Permission.WORKSPACE_SETTINGS);
  const { open: openUpgrade } = useModals(ModalType.PAYMENT);

  const isEditor = activeRole === UserRole.EDITOR;
  const isViewer = activeRole === UserRole.VIEWER;

  return (
    <>
      <SubHeaderItem>
        <Dropdown
          menu={
            <Menu noBottomPadding>
              {canUseWorkspaceSettings ? (
                <>
                  <MenuItem onClick={toggleCollaborators}>Manage Collaborators</MenuItem>
                  <MenuItem onClick={toggleWorkspaceSettings}>Workspace Settings</MenuItem>
                  <MenuItem divider />
                  {plan ? (
                    <MenuItem disabled capitalize teamItem>
                      {PLAN_NAMES[plan].label} Plan
                      {(plan === PlanType.STARTER || plan === PlanType.OLD_STARTER) && (
                        <>
                          &nbsp;-&nbsp; <ClickableText onClick={openUpgrade}>Upgrade</ClickableText>
                        </>
                      )}
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
              variant="outline"
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
      </SubHeaderItem>
      <SubHeaderItem>
        {/* notifications component */}
        <Dropdown
          menu={
            <Menu maxHeight="300px">
              <UpdatesPopover notifications={notifications.length ? notifications : DEFAULT_MESSAGE} />
            </Menu>
          }
          placement="bottom-end"
        >
          {(ref, onToggle, isOpen) => {
            return (
              <div style={{ position: 'relative' }} onMouseEnter={toggleUpdatesHover} onMouseLeave={toggleUpdatesHover}>
                {/* if updates available show notifications bubble and expand it on hover */}
                {newNotifications.length > 0 ? (
                  <>
                    <UpdateBubble
                      ref={ref}
                      onClick={stopPropagation(() => {
                        onToggle();
                        readNotifications();
                      })}
                      expand={onHover || isOpen}
                    >
                      <span>{newNotifications.length}</span>
                    </UpdateBubble>

                    <Numbered>
                      <SvgIcon icon="notifications" size={15} />
                    </Numbered>
                  </>
                ) : (
                  // else just show button with notifications icon
                  <IconButton
                    ref={ref}
                    variant="outline"
                    active={isOpen}
                    icon="notifications"
                    onClick={() => {
                      onToggle();
                      readNotifications();
                    }}
                    iconProps={{ width: 16, height: 15 }}
                    large
                  />
                )}
              </div>
            );
          }}
        </Dropdown>
      </SubHeaderItem>

      <SubHeaderItem>
        <ResourcesHeaderButton />
      </SubHeaderItem>
    </>
  );
}

const mapStateToProps = {
  notifications: notificationsSelector,
  plan: planTypeSelector,
};

const mapDispatchToProps = {
  readNotifications,
  leaveWorkspace,
};

export default connect(mapStateToProps, mapDispatchToProps)(RightNavSection);

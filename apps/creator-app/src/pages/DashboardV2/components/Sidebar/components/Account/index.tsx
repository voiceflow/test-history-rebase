import { Dropdown, Menu } from '@voiceflow/ui';
import React from 'react';

import NavigationSidebar from '@/components/NavigationSidebar';
import { Permission } from '@/constants/permissions';
import * as AccountDuck from '@/ducks/account';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, usePermission, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import * as S from './styles';

const Account: React.FC = () => {
  const user = useSelector(AccountDuck.userSelector);
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;
  const isLastAdmin = useSelector(WorkspaceV2.active.isLastAdminSelector);
  const logout = useDispatch(Session.logout);
  const goToAccount = useDispatch(Router.goToAccountV2);
  const [unableToLeaveWorkspace] = usePermission(Permission.UNABLE_TO_LEAVE_WORKSPACE);
  const leaveWorkspaceModal = ModalsV2.useModal(ModalsV2.Workspace.Leave);

  const canLeaveWorkspace = !isLastAdmin && !unableToLeaveWorkspace;

  return (
    <Dropdown
      offset={{ offset: [24, -5] }}
      placement="top-start"
      menu={
        <Menu>
          <Menu.Item disabled>{user.email}</Menu.Item>

          <Menu.Item divider />

          <Menu.Item onClick={() => goToAccount(workspaceID)}>Account</Menu.Item>

          {canLeaveWorkspace && <Menu.Item onClick={() => leaveWorkspaceModal.openVoid()}>Leave Workspace</Menu.Item>}

          <Menu.Item onClick={() => logout()}>Logout</Menu.Item>
        </Menu>
      }
    >
      {({ ref, onToggle, isOpen }) => (
        <NavigationSidebar.Footer ref={ref} onClick={onToggle} isMainMenu isOpen={isOpen}>
          <S.User user={user} />
          <S.Name>{user.name}</S.Name>
        </NavigationSidebar.Footer>
      )}
    </Dropdown>
  );
};

export default Account;

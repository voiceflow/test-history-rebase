import { Dropdown, Menu, preventDefault, Text } from '@voiceflow/ui';
import React from 'react';

import NavigationSidebar from '@/components/NavigationSidebar';
import * as Account from '@/ducks/account';
import * as Session from '@/ducks/session';
import { useDispatch, useSelector } from '@/hooks';

import * as S from '../styles';

const AccountSelector: React.FC = () => {
  const user = useSelector(Account.userSelector);
  const logout = useDispatch(Session.logout);

  return (
    <>
      <Dropdown
        offset={{ offset: [24, -5] }}
        menu={
          <Menu width={218}>
            <Menu.Item disabled>
              <Text>{user.email}</Text>
            </Menu.Item>
            <Menu.Item divider />
            <Menu.Item>
              <Text>Account</Text>
            </Menu.Item>
            <Menu.Item onClick={preventDefault(logout) as any}>
              <Text>Logout</Text>
            </Menu.Item>
          </Menu>
        }
        placement="top-start"
      >
        {(ref, onToggle, isOpen) => (
          <NavigationSidebar.Footer ref={ref} onClick={onToggle} isMainMenu isOpen={isOpen}>
            <S.StyledUser user={user} flat />
            <S.StyledText>{user.name}</S.StyledText>
          </NavigationSidebar.Footer>
        )}
      </Dropdown>
    </>
  );
};

export default AccountSelector;

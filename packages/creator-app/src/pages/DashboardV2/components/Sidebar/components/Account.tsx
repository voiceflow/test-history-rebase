import { Dropdown, Menu, preventDefault, Text } from '@voiceflow/ui';
import React from 'react';

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
        offset={{ offset: [0, -5] }}
        menu={
          <Menu>
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
        placement="top"
      >
        {(ref, onToggle, isOpen) => (
          <S.Footer ref={ref} onClick={onToggle} active={isOpen}>
            <S.StyledUser user={user} flat />
            <div>{user.name}</div>
          </S.Footer>
        )}
      </Dropdown>
    </>
  );
};

export default AccountSelector;

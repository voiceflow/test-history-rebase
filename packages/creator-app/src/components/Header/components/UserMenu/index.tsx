import { Dropdown, Menu, preventDefault, SvgIcon } from '@voiceflow/ui';
import React from 'react';
import { Link } from 'react-router-dom';

import * as Account from '@/ducks/account';
import * as Session from '@/ducks/session';
import { connect, styled } from '@/hocs';
import { ClassName } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import { UserNameContainer } from './components';

const StyledLink = styled(Link)`
  color: inherit !important;
  text-decoration: none !important;
`;

export const UserMenu: React.FC<ConnectedUserMenuProps> = ({ user, logout }) => (
  <div className="account-dropdown">
    <Dropdown
      menu={
        <Menu>
          <Menu.Item disabled>{user.email}</Menu.Item>
          <Menu.Item divider />

          <StyledLink to="/account">
            <Menu.Item>Account</Menu.Item>
          </StyledLink>
          <Menu.Item onClick={preventDefault(logout) as any}>Logout</Menu.Item>
        </Menu>
      }
      placement="bottom-end"
    >
      {(ref, onToggle, isOpen) => (
        <UserNameContainer className={ClassName.HEADER_USER_MENU} onClick={onToggle} ref={ref} isOpen={isOpen}>
          <div>{user.name}</div>
          <SvgIcon icon="caretDown" color={isOpen ? '#5d9df5' : '#6e849a'} size={9} />
        </UserNameContainer>
      )}
    </Dropdown>
  </div>
);

const mapStateToProps = {
  user: Account.userSelector,
};

const mapDispatchToProps = {
  logout: Session.logout,
};

type ConnectedUserMenuProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);

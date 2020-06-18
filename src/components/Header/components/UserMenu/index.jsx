import React from 'react';
import { Link } from 'react-router-dom';

import Dropdown from '@/components/Dropdown';
import Menu, { MenuItem } from '@/components/Menu';
import SvgIcon from '@/components/SvgIcon';
import * as Account from '@/ducks/account';
import * as Session from '@/ducks/session';
import { connect, styled } from '@/hocs';
import { preventDefault } from '@/utils/dom';

import { UserNameContainer } from './components';

const StyledLink = styled(Link)`
  color: inherit !important;
  text-decoration: none !important;
`;

export function UserMenu({ user, logout, preview }) {
  if (preview) {
    return (
      <div className="title-group no-select">
        <span className="text-blue" id="preview-title">
          <span className="dot" /> PREVIEW MODE
        </span>
      </div>
    );
  }

  return (
    <div className="account-dropdown">
      <Dropdown
        menu={
          <Menu>
            <MenuItem disabled>{user.email}</MenuItem>
            <MenuItem divider />

            <StyledLink to="/account">
              <MenuItem>Account</MenuItem>
            </StyledLink>
            <MenuItem onClick={preventDefault(logout)} tag="a" href="#">
              Logout
            </MenuItem>
          </Menu>
        }
        placement="bottom-end"
      >
        {(ref, onToggle, isOpen) => (
          <UserNameContainer onClick={onToggle} ref={ref} isOpen={isOpen}>
            <div>{user.name}</div>
            <SvgIcon icon="caretDown" color={isOpen ? '#5d9df5' : '#6e849a'} size={9} />
          </UserNameContainer>
        )}
      </Dropdown>
    </div>
  );
}

const mapStateToProps = {
  user: Account.userSelector,
};

const mapDispatchToProps = {
  logout: Session.logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);

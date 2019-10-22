import React from 'react';
import { Link } from 'react-router-dom';

import { User } from '@/components/User/User';
import Dropdown from '@/componentsV2/Dropdown';
import Menu, { MenuItem } from '@/componentsV2/Menu';
import { userSelector } from '@/ducks/account';
import { logout } from '@/ducks/session';
import { connect, styled } from '@/hocs';
import { preventDefault } from '@/utils/dom';

const StyledLink = styled(Link)`
  text-decoration: none;
  color: '#132144';
  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
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
    <div className="account-dropdown nav-child-item">
      <Dropdown
        menu={
          <Menu>
            <MenuItem disabled>{user.email}</MenuItem>
            <StyledLink style={{ color: '#132144' }} to="/account">
              <MenuItem>Account</MenuItem>
            </StyledLink>
            <MenuItem onClick={preventDefault(logout)} tag="a" href="#">
              Logout
            </MenuItem>
          </Menu>
        }
        placement="bottom-end"
      >
        {(ref, onToggle) => <User user={user} onClick={onToggle} ref={ref} className="pointer" />}
      </Dropdown>
    </div>
  );
}

const mapStateToProps = {
  user: userSelector,
};

const mapDispatchToProps = {
  logout,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserMenu);

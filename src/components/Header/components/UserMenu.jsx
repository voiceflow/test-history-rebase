import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';

import { User } from '@/components/User/User';
import { logout } from '@/ducks/account';

export function UserMenu({ user, logout, history, preview }) {
  if (preview) {
    <div className="title-group no-select">
      <span className="text-blue" id="preview-title">
        <span className="dot" /> PREVIEW MODE
      </span>
    </div>;
  }

  const userLogout = (e) => {
    e.preventDefault();
    logout().then(() => history.push('/login'));
    return false;
  };

  return (
    <UncontrolledDropdown className="account-dropdown">
      <DropdownToggle className="account hover" nav tag="div">
        <User user={user} className="pointer" />
      </DropdownToggle>
      <DropdownMenu right className="arrow arrow-right no-select">
        <DropdownItem header>{user.email}</DropdownItem>
        <DropdownItem divider />
        <Link className="dropdown-item" to="/account">
          Account
        </Link>
        {user.admin >= 100 && (
          <Link className="dropdown-item" to="/admin">
            Admin
          </Link>
        )}
        <DropdownItem onClick={userLogout} tag="a" href="#">
          Logout
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
}

const mapStateToProps = (state) => ({
  user: state.account,
});

const mapDispatchToProps = {
  logout,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserMenu);

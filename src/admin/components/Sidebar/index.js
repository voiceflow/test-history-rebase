import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Toggle from 'react-toggle';

import { SidebarWrapper } from '@/admin/components/Sidebar/styles';
import { history } from '@/admin/store';
import { logout } from '@/admin/store/ducks/account';
import { THEMES, toggleTheme } from '@/admin/store/ducks/admin';

const Sidebar = (props) => {
  return (
    <SidebarWrapper>
      <div className="logo" onClick={() => history.push('/')}>
        <img src={props.theme === THEMES.dark ? '/logo-white.svg' : '/logo.png'} alt="" />
        <div className="admin-icon">Internal</div>
      </div>
      <div className="stack-large">
        <NavLink exact={true} activeClassName="is-active" to="/admin">
          <i className="fal fa-home" /> Home
        </NavLink>
        <NavLink to="/admin/charges" activeClassName="is-active">
          <i className="fal fa-money-bill-wave" /> Finance
        </NavLink>
        <NavLink to="/admin/vendors" activeClassName="is-active">
          <i className="fal fa-store-alt" /> Vendors
        </NavLink>
        <div className="stack-small">
          <div className="sidebar-header">Skill Editors</div>
          <NavLink to="/admin/lookup" activeClassName="is-active">
            <i className="fal fa-search" /> Skill Lookup
          </NavLink>
          <NavLink to="/admin/copy" activeClassName="is-active">
            <i className="fal fa-copy" /> Copy
          </NavLink>
        </div>
        <div className="stack-small">
          <div className="sidebar-header">Customer</div>
          <NavLink to="/admin/beta" activeClassName="is-active">
            <i className="fal fa-rocket" /> Beta Program
          </NavLink>
          <NavLink to="/admin/betausers" activeClassName="is-active">
            <i className="fal fa-users" /> Beta Users
          </NavLink>
          <NavLink to="/admin/template" activeClassName="is-active">
            <i className="fal fa-ruler-combined" /> Templates
          </NavLink>
          <NavLink to="/admin/updates" activeClassName="is-active">
            <i className="fal fa-scroll" /> Product Updates
          </NavLink>
        </div>
        <NavLink exact={true} activeClassName="is-active" onClick={() => props.logout().then(() => history.push('/login'))} to="/">
          <i className="fal fa-home" /> Logout
        </NavLink>
      </div>
      <div className="settings">
        <div className="settings-title">settings</div>
        <div className="settings-user">
          Current Admin Id:
          <div className="creatorId">{props.creatorId}</div>
        </div>
        <div className="settings-toggle">
          Jank mode
          <Toggle
            checked={props.theme === THEMES.dark}
            icons={false}
            onChange={() => props.toggleTheme(props.theme === THEMES.dark ? THEMES.light : THEMES.dark)}
          />
        </div>
      </div>
    </SidebarWrapper>
  );
};

const mapStateToProps = (state) => ({
  theme: state.admin.theme,
  creatorId: state.account.id,
});

export default connect(
  mapStateToProps,
  { logout, toggleTheme }
)(Sidebar);

import { Toggle } from '@voiceflow/ui';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { wordmark, wordmarkLight } from '@/assets';
import { SidebarWrapper } from '@/components/Sidebar/styles';
import * as Account from '@/ducks/accountV2';
import * as AdminV2 from '@/ducks/adminV2';
import { connect } from '@/hocs';
import { history } from '@/store';

const Sidebar = (props) => (
  <SidebarWrapper>
    <div className="logo" onClick={() => history.push('/')}>
      <img src={props.theme === AdminV2.ThemeType.DARK ? wordmarkLight : wordmark} alt="" />
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
        <NavLink to="/admin/coupon" activeClassName="is-active">
          <i className="fal fa-store" /> Coupons
        </NavLink>
        <NavLink to="/admin/referral" activeClassName="is-active">
          <i className="fal fa-store" /> Referral
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
        <div className="creatorId">{props?.creator?.id}</div>
      </div>
      <div className="settings-toggle">
        Jank mode
        <Toggle
          checked={props.theme === AdminV2.ThemeType.DARK}
          onChange={() => props.toggleTheme(props.theme === AdminV2.ThemeType.DARK ? AdminV2.ThemeType.LIGHT : AdminV2.ThemeType.DARK)}
        />
      </div>
    </div>
  </SidebarWrapper>
);

const mapStateToProps = {
  creator: Account.accountSelector,
};

export default connect(mapStateToProps, { logout: Account.logout, toggleTheme: AdminV2.toggleTheme })(Sidebar);

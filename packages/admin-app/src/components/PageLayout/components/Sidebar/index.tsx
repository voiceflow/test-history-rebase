import { ClickableText, Toggle } from '@voiceflow/ui';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { wordmark, wordmarkLight } from '@/assets';
import { ThemeType } from '@/constants';
import { ThemeContext } from '@/contexts/ThemeProvider';
import * as Account from '@/ducks/accountV2';
import { history } from '@/store';

import { Container } from './components';

const Sidebar: React.FC = () => {
  const user = useSelector(Account.accountSelector);
  const dispatch = useDispatch();
  const { theme, setTheme } = React.useContext(ThemeContext);

  const activeClassName = ({ isActive }: { isActive: boolean }): string => (isActive ? 'is-active' : '');

  return (
    <Container>
      <div className="logo" onClick={() => history.push('/')}>
        <img src={theme === ThemeType.DARK ? wordmarkLight : wordmark} alt="" />
        <div className="admin-icon">Internal</div>
      </div>

      <div className="stack-large">
        <NavLink to="/admin/" className={activeClassName}>
          <i className="fal fa-home" /> Home
        </NavLink>

        <NavLink to="/admin/charges" className={activeClassName}>
          <i className="fal fa-money-bill-wave" /> Finance
        </NavLink>

        <NavLink to="/admin/vendors" className={activeClassName}>
          <i className="fal fa-store-alt" /> Vendors
        </NavLink>

        <div className="stack-small">
          <div className="sidebar-header">Skill Editors</div>

          <NavLink to="/admin/copy" className={activeClassName}>
            <i className="fal fa-copy" /> Copy
          </NavLink>
        </div>

        <div className="stack-small">
          <div className="sidebar-header">Customer</div>

          <NavLink to="/admin/coupon" className={activeClassName}>
            <i className="fal fa-store" /> Education Partner Codes
          </NavLink>

          <NavLink to="/admin/referral" className={activeClassName}>
            <i className="fal fa-store" /> Discounts and Promotions
          </NavLink>

          <NavLink to="/admin/updates" className={activeClassName}>
            <i className="fal fa-scroll" /> Product Updates
          </NavLink>
        </div>

        <ClickableText onClick={() => dispatch(Account.logout())}>
          <i className="fal fa-home" /> Logout
        </ClickableText>
      </div>

      <div className="settings">
        <div className="settings-title">settings</div>

        <div className="settings-user">
          Current Admin Id:
          <div className="creatorId">{user?.id}</div>
        </div>

        <div className="settings-toggle">
          Jank mode
          <Toggle checked={theme === ThemeType.DARK} onChange={() => setTheme(theme === ThemeType.DARK ? ThemeType.LIGHT : ThemeType.DARK)} />
        </div>
      </div>
    </Container>
  );
};

export default Sidebar;

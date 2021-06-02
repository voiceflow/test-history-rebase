import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import Sidebar from '@/admin/components/Sidebar';
import BetaProgram from '@/admin/pages/BetaProgram';
import BetaUsersList from '@/admin/pages/BetaProgram/BetaUsersList';
import Copy from '@/admin/pages/Copy';
import Coupon from '@/admin/pages/Coupon';
import FinanceBoard from '@/admin/pages/Finance';
import Home from '@/admin/pages/Home';
import ProductUpdates from '@/admin/pages/ProductUpdates';
import Referral from '@/admin/pages/Referral';
import SkillLookup from '@/admin/pages/SkillLookup';
import Template from '@/admin/pages/Templates';
import Vendors from '@/admin/pages/Vendors';
import * as Account from '@/admin/store/ducks/accountV2';
import * as AdminDuck from '@/admin/store/ducks/adminV2';
import { mainTheme, mappedThemes } from '@/admin/styles/theme';
import { connect } from '@/hocs';
import theme from '@/styles/theme';

import { AdminWrapper, PageWrapper } from './styles';

class Admin extends React.Component {
  componentDidMount() {
    this.props.checkSession();
  }

  render() {
    return (
      <ThemeProvider
        theme={{
          ...theme,
          ...(mappedThemes[this.props.theme] || mainTheme),
        }}
      >
        <AdminWrapper>
          <div>
            <Sidebar />
            <PageWrapper>
              <Route exact path="/admin" component={Home} />
              <Route path="/admin/template" component={Template} />
              <Route path="/admin/coupon" component={Coupon} />
              <Route path="/admin/updates" component={ProductUpdates} />
              <Route path="/admin/copy" component={Copy} />
              <Route path="/admin/charges/:creator_id" component={FinanceBoard} />
              <Route exact path="/admin/charges" component={FinanceBoard} />
              <Route path="/admin/lookup/:project_id" component={SkillLookup} />
              <Route exact path="/admin/lookup" component={SkillLookup} />
              <Route exact path="/admin/referral" component={Referral} />
              <Route path="/admin/vendors/:creator_id" component={Vendors} />
              <Route exact path="/admin/vendors" component={Vendors} />
              <Route path="/admin/beta" component={BetaProgram} />
              <Route path="/admin/betausers" component={BetaUsersList} />
              <Redirect exact path="/" to="/admin/" />
            </PageWrapper>
          </div>
        </AdminWrapper>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = {
  theme: AdminDuck.themeSelector,
  dark: AdminDuck.darkSelector,
};

const mapDispatchToProps = {
  checkSession: Account.checkSession,
};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);

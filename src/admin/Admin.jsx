import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import Sidebar from '@/admin/components/Sidebar';
import BetaProgram from '@/admin/containers/BetaProgram';
import BetaUsersList from '@/admin/containers/BetaProgram/BetaUsersList';
import Copy from '@/admin/containers/Copy';
import Coupon from '@/admin/containers/Coupon';
import FinanceBoard from '@/admin/containers/Finance';
import Home from '@/admin/containers/Home';
import ProductUpdates from '@/admin/containers/ProductUpdates';
import SkillLookup from '@/admin/containers/SkillLookup';
import Template from '@/admin/containers/Templates';
import Vendors from '@/admin/containers/Vendors';
import { checkSession } from '@/admin/store/ducks/account';
import { mainTheme, mappedThemes } from '@/admin/styles/theme';
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
              <Route path="/admin/lookup/:version_id" component={SkillLookup} />
              <Route exact path="/admin/lookup" component={SkillLookup} />
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

const mapStateToProps = (state) => ({
  dark: state.admin.dark,
  theme: state.admin.theme,
});

export default connect(
  mapStateToProps,
  { checkSession }
)(Admin);

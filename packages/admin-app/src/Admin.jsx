import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import { connect } from '@/hocs';

import Sidebar from './components/Sidebar';
import * as Account from './ducks/accountV2';
import Copy from './pages/Copy';
import Coupon from './pages/Coupon';
import FinanceBoard from './pages/Finance';
import Home from './pages/Home';
import ProductUpdates from './pages/ProductUpdates';
import Referral from './pages/Referral';
import Vendors from './pages/Vendors';
import { AdminWrapper, PageWrapper } from './styles/components';

class Admin extends React.Component {
  componentDidMount() {
    this.props.checkSession();
  }

  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <AdminWrapper>
        <div>
          <Sidebar />
          <PageWrapper>
            <Route exact path="/admin" component={Home} />
            <Route path="/admin/coupon" component={Coupon} />
            <Route path="/admin/updates" component={ProductUpdates} />
            <Route path="/admin/copy" component={Copy} />
            <Route path="/admin/charges/:creator_id" component={FinanceBoard} />
            <Route exact path="/admin/charges" component={FinanceBoard} />
            <Route exact path="/admin/referral" component={Referral} />
            <Route path="/admin/vendors/:creator_id" component={Vendors} />
            <Route exact path="/admin/vendors" component={Vendors} />
            <Redirect exact path="/" to="/admin/" />
          </PageWrapper>
        </div>
      </AdminWrapper>
    );
  }
}

const mapDispatchToProps = {
  checkSession: Account.checkSession,
};

export default connect(null, mapDispatchToProps)(Admin);

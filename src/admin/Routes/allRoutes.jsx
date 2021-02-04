import React from 'react';

import AuthenticatedRouter from '@/admin/Routes/AuthenticatedRouter';
import LoadingGate from '@/admin/Routes/LoadingGate';
import PublicRouter from '@/admin/Routes/PublicRouter';
import * as Account from '@/admin/store/ducks/accountV2';
import { connect } from '@/hocs';

class AllRoutes extends React.Component {
  getUser = () => {
    if (Account.getAuth()) {
      this.props.checkSession();
    }
  };

  isInitialized = () => {
    if (!Account.getAuth()) return false;

    return !!this.props.user.id && this.props.user.admin >= 100;
  };

  render() {
    return (
      <div className="body">
        <LoadingGate label="Session" load={this.getUser} isLoaded={!Account.getAuth() || this.props.user.id}>
          {() => (this.isInitialized() ? <AuthenticatedRouter /> : <PublicRouter />)}
        </LoadingGate>
      </div>
    );
  }
}

const mapStateToProps = {
  user: Account.accountSelector,
};

const mapDispatchToProps = {
  checkSession: Account.checkSession,
};

export default connect(mapStateToProps, mapDispatchToProps)(AllRoutes);

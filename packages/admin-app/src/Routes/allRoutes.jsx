import React from 'react';

import * as Account from '@/ducks/accountV2';
import * as AdminDuck from '@/ducks/adminV2';
import { connect } from '@/hocs';

import AuthenticatedRouter from './AuthenticatedRouter';
import LoadingGate from './LoadingGate';
import PublicRouter from './PublicRouter';

class AllRoutes extends React.Component {
  getUser = () => {
    if (Account.getAuth()) {
      this.props.checkSession();
    }
  };

  isInitialized = () => {
    if (!Account.getAuth()) return false;

    return !!this.props.user.id && this.props.user.internalAdmin;
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
  theme: AdminDuck.themeSelector,
};

const mapDispatchToProps = {
  checkSession: Account.checkSession,
};

export default connect(mapStateToProps, mapDispatchToProps)(AllRoutes);

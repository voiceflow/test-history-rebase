import React from 'react';
import { connect } from 'react-redux';

import AuthenticatedRouter from '@/admin/Routes/AuthenticatedRouter';
import LoadingGate from '@/admin/Routes/LoadingGate';
import PublicRouter from '@/admin/Routes/PublicRouter';
import { checkSession, getAuth } from '@/admin/store/ducks/account';

class AllRoutes extends React.Component {
  getUser = () => {
    if (getAuth()) {
      this.props.checkSession();
    }
  };

  isInitialized = () => {
    if (!getAuth()) {
      return false;
    }
    if (this.props.user.id && this.props.user.admin >= 100) {
      return true;
    }
  };

  render() {
    return (
      <div className="body">
        <LoadingGate load={this.getUser} isLoaded={!getAuth() || this.props.user.id}>
          {() => (this.isInitialized() ? <AuthenticatedRouter /> : <PublicRouter />)}
        </LoadingGate>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.account,
});

export default connect(
  mapStateToProps,
  { checkSession }
)(AllRoutes);

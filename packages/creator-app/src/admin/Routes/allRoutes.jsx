import React from 'react';
import { ThemeProvider } from 'styled-components';

import AuthenticatedRouter from '@/admin/Routes/AuthenticatedRouter';
import LoadingGate from '@/admin/Routes/LoadingGate';
import PublicRouter from '@/admin/Routes/PublicRouter';
import * as Account from '@/admin/store/ducks/accountV2';
import * as AdminDuck from '@/admin/store/ducks/adminV2';
import { mainTheme, mappedThemes } from '@/admin/styles/theme';
import { connect } from '@/hocs';
import theme from '@/styles/theme';

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
    const THEME = {
      ...theme,
      ...(mappedThemes[this.props.theme] || mainTheme),
    };

    return (
      <ThemeProvider theme={THEME}>
        <div className="body">
          <LoadingGate label="Session" load={this.getUser} isLoaded={!Account.getAuth() || this.props.user.id}>
            {() => (this.isInitialized() ? <AuthenticatedRouter /> : <PublicRouter />)}
          </LoadingGate>
        </div>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = {
  user: Account.accountSelector,
  theme: AdminDuck.themeSelector,
  dark: AdminDuck.darkSelector,
};

const mapDispatchToProps = {
  checkSession: Account.checkSession,
};

export default connect(mapStateToProps, mapDispatchToProps)(AllRoutes);

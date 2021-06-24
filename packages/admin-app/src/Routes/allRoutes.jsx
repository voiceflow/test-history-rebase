import React from 'react';
import { ThemeProvider } from 'styled-components';

import * as Account from '@/ducks/accountV2';
import * as AdminDuck from '@/ducks/adminV2';
import { connect } from '@/hocs';
import theme, { mainTheme, mappedThemes } from '@/styles/theme';

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

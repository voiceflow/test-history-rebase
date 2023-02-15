import { Box } from '@voiceflow/ui';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Page from '@/components/Page';
import { Path } from '@/config/routes';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import { Identifier } from '@/styles/constants';

import AccountIntegrationsSection from './components/AccountIntegrations';
import AccountProfileSection from './components/AccountProfile';
import AccountSidebar from './components/AccountSidebar';

const AccountPage: React.FC = () => {
  const goToDashboard = useDispatch(Router.goToDashboard);

  return (
    <Page
      renderHeader={() => (
        <Page.Header>
          <Page.Header.BackButton navSidebarWidth onClick={() => goToDashboard()} />
          <Page.Header.Title>Account</Page.Header.Title>
        </Page.Header>
      )}
      renderSidebar={() => <AccountSidebar />}
    >
      <Box id={Identifier.ACCOUNT_PAGE} maxWidth={900} p={32}>
        <Switch>
          <Route path={Path.ACCOUNT_PROFILE} component={AccountProfileSection} />
          <Route path={Path.ACCOUNT_INTEGRATIONS} component={AccountIntegrationsSection} />
          <Redirect to={Path.ACCOUNT_PROFILE} />
        </Switch>
      </Box>
    </Page>
  );
};

export default AccountPage;

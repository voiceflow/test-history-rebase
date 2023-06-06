import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Page from '@/components/Page';
import { Path } from '@/config/routes';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';

import { Sidebar } from '../../components';
import { Header } from './components';
import { Integrations, Profile } from './pages';

const Account: React.FC = () => {
  return (
    <Page white renderSidebar={() => <Sidebar />} renderHeader={() => <Header />}>
      <Page.Content>
        <Switch>
          <Route path={Path.WORKSPACE_PROFILE} component={Profile} />
          <Route path={Path.WORKSPACE_INTEGRATIONS} component={Integrations} />

          <RedirectWithSearch to={Path.WORKSPACE_PROFILE} />
        </Switch>
      </Page.Content>
    </Page>
  );
};

export default Account;

import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Page from '@/components/Page';
import { Path } from '@/config/routes';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';

import { Sidebar } from '../../components';
import { Header } from './components';
import { General } from './pages';

const Settings: React.FC = () => {
  return (
    <Page white renderSidebar={() => <Sidebar />} renderHeader={() => <Header />}>
      <Page.Content>
        <Switch>
          <Route path={Path.WORKSPACE_SETTINGS} component={General} />

          <RedirectWithSearch to={Path.WORKSPACE_PROFILE} />
        </Switch>
      </Page.Content>
    </Page>
  );
};

export default Settings;

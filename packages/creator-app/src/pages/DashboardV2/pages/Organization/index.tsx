import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Page from '@/components/Page';
import { Path } from '@/config/routes';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';

import { Sidebar } from '../../components';
import { Header } from './components';
import { General, Members, SSO } from './pages';

const MembersAndBilling: React.FC = () => (
  <Page renderHeader={() => <Header />} renderSidebar={() => <Sidebar />}>
    <Page.Content>
      <Switch>
        <Route path={Path.WORKSPACE_GENERAL_ORG} component={General} />
        <Route path={Path.WORKSPACE_MEMBERS_ORG} component={Members} />
        <Route path={Path.WORKSPACE_SSO_ORG} component={SSO} />

        <RedirectWithSearch to={Path.WORKSPACE_MEMBERS} />
      </Switch>
    </Page.Content>
  </Page>
);

export default MembersAndBilling;

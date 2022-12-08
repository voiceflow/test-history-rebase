import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Page from '@/components/Page';
import { Path } from '@/config/routes';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';

import { Sidebar } from '../../components';
import { Header } from './components';
import { Billing, Members } from './pages';

const MembersAndBilling: React.FC = () => (
  <Page renderHeader={() => <Header />} renderSidebar={() => <Sidebar />}>
    <Page.Content style={{ backgroundColor: '#ffffff', minHeight: '100%' }}>
      <Switch>
        <Route path={Path.WORKSPACE_MEMBERS} component={Members} />
        <Route path={Path.WORKSPACE_BILLING} component={Billing} />

        <RedirectWithSearch to={Path.WORKSPACE_MEMBERS} />
      </Switch>
    </Page.Content>
  </Page>
);

export default MembersAndBilling;

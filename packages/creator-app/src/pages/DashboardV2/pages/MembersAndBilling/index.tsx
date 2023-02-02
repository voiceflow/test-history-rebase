import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Page from '@/components/Page';
import { Path } from '@/config/routes';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';

import { Sidebar } from '../../components';
import { Header } from './components';
import { Billing, Members } from './pages';
import * as S from './styles';

const MembersAndBilling: React.FC = () => (
  <Page white renderHeader={() => <Header />} renderSidebar={() => <Sidebar />}>
    <S.StyledPageContent>
      <Switch>
        <Route path={Path.WORKSPACE_MEMBERS} component={Members} />
        <Route path={Path.WORKSPACE_BILLING} component={Billing} />

        <RedirectWithSearch to={Path.WORKSPACE_MEMBERS} />
      </Switch>
    </S.StyledPageContent>
  </Page>
);

export default MembersAndBilling;

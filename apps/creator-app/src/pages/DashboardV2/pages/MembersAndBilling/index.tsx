import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Page from '@/components/Page';
import { Path } from '@/config/routes';
import * as Organization from '@/ducks/organization';
import { useSelector } from '@/hooks';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';

import { Sidebar } from '../../components';
import { Header } from './components';
import { Billing, LegacyBilling, LegacyMembers, Members } from './pages';
import * as S from './styles';

const MembersAndBilling: React.FC = () => {
  const organization = useSelector(Organization.active.organizationSelector);

  return (
    <Page white renderHeader={() => <Header />} renderSidebar={() => <Sidebar />}>
      <S.StyledPageContent>
        <Switch>
          {organization?.chargebeeSubscriptionID ? (
            <>
              <Route path={Path.WORKSPACE_MEMBERS} component={Members} />
              <Route path={Path.WORKSPACE_BILLING} component={Billing} />
            </>
          ) : (
            <>
              <Route path={Path.WORKSPACE_MEMBERS} component={LegacyMembers} />
              <Route path={Path.WORKSPACE_BILLING} component={LegacyBilling} />
            </>
          )}

          <RedirectWithSearch to={Path.WORKSPACE_MEMBERS} />
        </Switch>
      </S.StyledPageContent>
    </Page>
  );
};

export default MembersAndBilling;

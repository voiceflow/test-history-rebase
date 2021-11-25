import { Box } from '@voiceflow/ui';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Page from '@/components/Page';
import ProjectPage from '@/components/ProjectPage';
import { Path } from '@/config/routes';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import { Identifier } from '@/styles/constants';

import AccountIntegrationsSection from './components/AccountIntegrations';
import AccountProfileSection from './components/AccountProfile';
import { AccountSidebar } from './components/AccountSidebar';

const AccountPageV2: React.FC = () => {
  const goToDashboard = useDispatch(Router.goToDashboard);

  return (
    <Page navigateBackText="Back" onNavigateBack={goToDashboard} header="Account">
      <ProjectPage renderSidebar={() => <AccountSidebar />}>
        <Box id={Identifier.ACCOUNT_PAGE} maxWidth={900} p={32}>
          <Switch>
            <Route path={Path.ACCOUNT_PROFILE} component={AccountProfileSection} />
            <Route path={Path.ACCOUNT_INTEGRATIONS} component={AccountIntegrationsSection} />
            <Redirect to={Path.ACCOUNT_PROFILE} />
          </Switch>
        </Box>
      </ProjectPage>
    </Page>
  );
};

export default AccountPageV2;

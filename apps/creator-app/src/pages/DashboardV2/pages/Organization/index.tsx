import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Page from '@/components/Page';
import {
  useOrganizationDefaultPagePath,
  useOrganizationMembersPagePath,
  useOrganizationSettingsPagePath,
  useOrganizationSSOPagePath,
} from '@/hooks/organization';

import { Sidebar } from '../../components';
import { Header } from './components';
import { General, Members, SSO } from './pages';
import * as S from './styles';

const Organization: React.FC = () => {
  const ssoPagePath = useOrganizationSSOPagePath();
  const membersPagePath = useOrganizationMembersPagePath();
  const defaultPagePath = useOrganizationDefaultPagePath();
  const settingsPagePath = useOrganizationSettingsPagePath();

  return (
    <Page white renderHeader={() => <Header />} renderSidebar={() => <Sidebar />}>
      <S.StyledPageContent>
        <Switch>
          {settingsPagePath && <Route path={settingsPagePath} component={General} />}
          {membersPagePath && <Route path={membersPagePath} component={Members} />}
          {ssoPagePath && <Route path={ssoPagePath} component={SSO} />}

          {!!defaultPagePath && <Redirect to={defaultPagePath} />}
        </Switch>
      </S.StyledPageContent>
    </Page>
  );
};

export default Organization;

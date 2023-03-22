import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Page from '@/components/Page';
import { Path } from '@/config/routes';
import { Permission } from '@/constants/permissions';
import { useFeature } from '@/hooks/feature';
import { usePermission } from '@/hooks/permission';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';

import { Sidebar } from '../../components';
import { Header } from './components';
import { Members, SSO } from './pages';
import * as S from './styles';

const Organization: React.FC = () => {
  const organizationMembers = useFeature(Realtime.FeatureFlag.ORGANIZATION_MEMBERS);

  const [canManageOrgMembers] = usePermission(Permission.ORGANIZATION_MANAGE_MEMBERS, { organizationAdmin: true });

  return (
    <Page white renderHeader={() => <Header />} renderSidebar={() => <Sidebar />}>
      <S.StyledPageContent>
        <Switch>
          {/* <Route path={Path.WORKSPACE_ORGANIZATION_SETTINGS} component={General} /> */}
          {organizationMembers.isEnabled && canManageOrgMembers && <Route path={Path.WORKSPACE_ORGANIZATION_MEMBERS} component={Members} />}

          <Route path={Path.WORKSPACE_ORGANIZATION_SSO} component={SSO} />

          <RedirectWithSearch
            to={organizationMembers.isEnabled && canManageOrgMembers ? Path.WORKSPACE_ORGANIZATION_MEMBERS : Path.WORKSPACE_ORGANIZATION_SSO}
          />
        </Switch>
      </S.StyledPageContent>
    </Page>
  );
};

export default Organization;

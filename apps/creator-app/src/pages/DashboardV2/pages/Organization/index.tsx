import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Page from '@/components/Page';
import { Path } from '@/config/routes';
import { Permission } from '@/constants/permissions';
import { OrganizationSubscriptionGate } from '@/gates';
import { withBatchLoadingGate } from '@/hocs/withBatchLoadingGate';
import { useActiveWorkspace, useFeature, usePermission } from '@/hooks';

import { Sidebar } from '../../components';
import { Header } from './components';
import { General, Members, SSO } from './pages';
import * as S from './styles';

const Organization: React.FC = () => {
  const organizationMembers = useFeature(Realtime.FeatureFlag.ORGANIZATION_MEMBERS);
  const [canManageOrgMembers] = usePermission(Permission.ORGANIZATION_MANAGE_MEMBERS);
  const workspace = useActiveWorkspace();
  const [canConfigureOrganization] = usePermission(Permission.EDIT_ORGANIZATION);
  const orgSettings = useFeature(Realtime.FeatureFlag.ORG_GENERAL_SETTINGS);

  const canManageSSO = canConfigureOrganization && workspace?.organizationID;

  return (
    <Page white renderHeader={() => <Header />} renderSidebar={() => <Sidebar />}>
      <S.StyledPageContent>
        <Switch>
          {organizationMembers.isEnabled && canManageOrgMembers && <Route path={Path.WORKSPACE_ORGANIZATION_MEMBERS} component={Members} />}
          {canConfigureOrganization && orgSettings.isEnabled && <Route path={Path.WORKSPACE_ORGANIZATION_SETTINGS} component={General} />}
          {canManageSSO && <Route path={Path.WORKSPACE_ORGANIZATION_SSO} component={SSO} />}
        </Switch>
      </S.StyledPageContent>
    </Page>
  );
};

export default withBatchLoadingGate(OrganizationSubscriptionGate)(Organization);

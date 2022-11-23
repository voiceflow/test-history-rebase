import React from 'react';
import { generatePath, Route, Switch } from 'react-router-dom';

import NavLink from '@/components/NavLink';
import { Path } from '@/config/routes';
import { useActiveWorkspace } from '@/hooks';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';

import { HeaderWrapper } from '../Header/styles';
import Members from './Members';
import * as S from './styles';

const DashboardV2TeamAndBilling: React.FC = () => {
  const workspace = useActiveWorkspace();
  const workspaceID = workspace?.id;

  return (
    <>
      <HeaderWrapper>
        <S.LinksWrapper>
          <NavLink as={S.Link} to={generatePath(Path.WORKSPACE_TEAM_AND_BILLING_MEMBERS, { workspaceID })} exact>
            Members
          </NavLink>
          <NavLink as={S.Link} to={generatePath(Path.WORKSPACE_TEAM_AND_BILLING_BILLING, { workspaceID })} exact>
            Billing
          </NavLink>
        </S.LinksWrapper>
      </HeaderWrapper>

      <Switch>
        <Route path={Path.WORKSPACE_TEAM_AND_BILLING_MEMBERS} component={Members} />
        <Route path={Path.WORKSPACE_TEAM_AND_BILLING_BILLING} component={Members} />

        <RedirectWithSearch to={Path.WORKSPACE_TEAM_AND_BILLING_MEMBERS} />
      </Switch>
    </>
  );
};

export default DashboardV2TeamAndBilling;

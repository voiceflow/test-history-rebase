import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';
import { withBatchLoadingGate } from '@/hocs';
import { DashboardClassName } from '@/styles/constants';

import { Sidebar } from './components';
import * as S from './components/styles';
import { DashboardGate } from './gates';
import { ProjectList, TeamAndBilling } from './pages';

const Dashboard: React.FC = () => {
  return (
    <S.DashboardWrapper id="app" className={DashboardClassName.DASHBOARD}>
      <S.BodyWrapper>
        <Sidebar />
        <S.ContentWrapper>
          <Switch>
            <Route path={Path.WORKSPACE_TEAM_AND_BILLING} component={TeamAndBilling} />
            <Route path="/" component={ProjectList} />
          </Switch>
        </S.ContentWrapper>
      </S.BodyWrapper>
    </S.DashboardWrapper>
  );
};

export default withBatchLoadingGate(DashboardGate)(Dashboard);

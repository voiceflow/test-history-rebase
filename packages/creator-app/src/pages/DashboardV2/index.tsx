import React from 'react';

import { withBatchLoadingGate } from '@/hocs';
import { DashboardClassName } from '@/styles/constants';

import { Header, ProjectList, Sidebar } from './components';
import * as S from './components/styles';
import { DashboardGate } from './gates';

const Dashboard: React.FC = () => {
  return (
    <S.DashboardWrapper id="app" className={DashboardClassName.DASHBOARD}>
      <Header />
      <S.BodyWrapper>
        <Sidebar />
        <ProjectList />
      </S.BodyWrapper>
    </S.DashboardWrapper>
  );
};

export default withBatchLoadingGate(DashboardGate)(Dashboard);

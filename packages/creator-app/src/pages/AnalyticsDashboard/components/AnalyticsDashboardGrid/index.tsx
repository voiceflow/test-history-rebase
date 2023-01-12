import React from 'react';

import AnalyticsDashboardLoadingScreen from '../AnalyticsDashboardLoadingScreen';
import * as S from './styles';

const AnalyticsDashboardGrid: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <AnalyticsDashboardLoadingScreen>
      <S.Grid>{children}</S.Grid>
    </AnalyticsDashboardLoadingScreen>
  );
};

export default AnalyticsDashboardGrid;

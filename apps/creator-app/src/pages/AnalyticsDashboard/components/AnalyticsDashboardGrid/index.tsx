import React from 'react';

import AnalyticsDashboardLoadingScreen from '../AnalyticsDashboardLoadingScreen';
import * as S from './styles';

const AnalyticsDashboardGrid: React.FC<React.PropsWithChildren & { isNewLayout?: boolean }> = ({
  children,
  isNewLayout,
}) => {
  return (
    <AnalyticsDashboardLoadingScreen isNewLayout={isNewLayout}>
      <S.Grid>{children}</S.Grid>
    </AnalyticsDashboardLoadingScreen>
  );
};

export default AnalyticsDashboardGrid;

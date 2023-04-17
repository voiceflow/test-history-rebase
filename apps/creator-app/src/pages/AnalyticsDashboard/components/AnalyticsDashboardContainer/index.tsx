import React from 'react';

import * as S from './styles';

const AnalyticsDashboardContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <S.Container column>{children}</S.Container>;
};

export default AnalyticsDashboardContainer;

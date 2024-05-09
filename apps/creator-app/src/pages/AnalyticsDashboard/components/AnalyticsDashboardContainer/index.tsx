import React from 'react';

import * as S from './styles';

const AnalyticsDashboardContainer: React.FC<React.PropsWithChildren & { isNewLayout?: boolean }> = ({ children, isNewLayout }) => {
  return (
    <S.Container column isNewLayout={isNewLayout}>
      {children}
    </S.Container>
  );
};

export default AnalyticsDashboardContainer;

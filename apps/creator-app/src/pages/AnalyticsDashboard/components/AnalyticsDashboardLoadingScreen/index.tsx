import { Spinner } from '@voiceflow/ui';
import React from 'react';

import { AnalyticsDashboardContext } from '../../context';
import * as S from './styles';

const AnalyticsDashboardLoadingScreen: React.FC<React.PropsWithChildren> = ({ children }) => {
  const analyticsDashboard = React.useContext(AnalyticsDashboardContext);

  return (
    <>
      {children}
      <S.BlockingPage visible={!analyticsDashboard.isLoaded}>
        <Spinner borderLess message="Preparing data set..." fillContainer={false} />
      </S.BlockingPage>
    </>
  );
};

export default AnalyticsDashboardLoadingScreen;

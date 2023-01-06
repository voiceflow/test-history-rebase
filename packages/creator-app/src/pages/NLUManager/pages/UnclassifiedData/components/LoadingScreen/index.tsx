import { Divider } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

const LoadingScreen: React.OldFC = () => {
  return (
    <div>
      {Array.from(Array(10).keys()).map((i) => (
        <>
          <S.LoadingRow>
            <S.LoadingDot />
            <div>
              <S.LoadingBarTitle />
              <S.LoadingBarSubtitle />
            </div>
            <S.LoadingBarDescription />
          </S.LoadingRow>
          {i < 9 && <Divider offset={0} isSecondaryColor />}
        </>
      ))}
    </div>
  );
};

export default LoadingScreen;

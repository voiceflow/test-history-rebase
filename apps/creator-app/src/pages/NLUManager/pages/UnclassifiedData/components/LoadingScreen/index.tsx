import { Divider } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

const LoadingScreen: React.FC = () => (
  <div>
    {Array.from({ length: 10 }).map((_, index) => (
      <>
        <S.LoadingRow>
          <S.LoadingDot />

          <div>
            <S.LoadingBarTitle />
            <S.LoadingBarSubtitle />
          </div>
          <S.LoadingBarDescription />
        </S.LoadingRow>

        {index < 9 && <Divider offset={0} isSecondaryColor />}
      </>
    ))}
  </div>
);

export default React.memo(LoadingScreen);

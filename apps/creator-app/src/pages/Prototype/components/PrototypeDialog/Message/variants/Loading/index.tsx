import type { Nullable } from '@voiceflow/common';
import React from 'react';
import type { AnyStyledComponent } from 'styled-components';

import type { PMStatus } from '@/pages/Prototype/types';
import { ClassName } from '@/styles/constants';

import * as S from './styles';

interface LoadingProps {
  isLoading?: boolean;
  avatarURL?: string;
  animationContainer?: AnyStyledComponent;
  pmStatus: Nullable<PMStatus>;
}

const Loading: React.FC<LoadingProps> = ({ isLoading, pmStatus, avatarURL, animationContainer }) => (
  <S.Container
    className={ClassName.CHAT_DIALOG_LOADING_MESSAGE}
    withLogo
    isFirstInSeries
    withAnimation
    isLoading={isLoading}
    animationContainer={animationContainer}
    avatarURL={avatarURL}
    isLastInSeries
    forceIcon
    pmStatus={pmStatus}
  >
    <div className="dot-falling"></div>
  </S.Container>
);

export default Loading;

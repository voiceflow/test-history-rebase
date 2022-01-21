import { Constants } from '@voiceflow/general-types';
import React from 'react';

import { ModalType } from '@/constants';
import { AlexaStageType, DialogflowStageType, GoogleStageType } from '@/constants/platforms';
import * as ProjectV2 from '@/ducks/projectV2';
import { useModals, useSelector } from '@/hooks';

import BaseConnectPlatformModal from './BaseConnectPlatformModal';
import { AlexaIdleStage, DialogflowIdleStage, GoogleIdleStage } from './BaseConnectPlatformModal/components/IdleStage';
import { useConnectState } from './BaseConnectPlatformModal/hooks';
import { getPlatformModalProps } from './BaseConnectPlatformModal/utils';

const MODAL_TYPE = ModalType.CONNECT_PLATFORM;
const PLATFORM_TYPE = Constants.PlatformType;

const ConnectActivePlatformModal: React.FC = () => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const { data, isOpened } = useModals<{
    stage: AlexaStageType | GoogleStageType | DialogflowStageType;
    updateCurrentStage: (data: unknown) => void;
  }>(MODAL_TYPE);
  const { stage } = data;

  const [state, api] = useConnectState(isOpened);

  const isAlexa = platform === PLATFORM_TYPE.ALEXA;
  const isGoogle = platform === PLATFORM_TYPE.GOOGLE;
  const isDialogflow = platform === PLATFORM_TYPE.DIALOGFLOW_ES_CHAT || platform === PLATFORM_TYPE.DIALOGFLOW_ES_VOICE;

  if (isAlexa && stage === AlexaStageType.IDLE) {
    return <AlexaIdleStage modalType={MODAL_TYPE} />;
  }

  if (isGoogle && stage === GoogleStageType.IDLE) {
    return <GoogleIdleStage modalType={MODAL_TYPE} />;
  }

  if (isDialogflow && stage === DialogflowStageType.IDLE) {
    return <DialogflowIdleStage modalType={MODAL_TYPE} />;
  }

  return (
    <BaseConnectPlatformModal
      modalType={MODAL_TYPE}
      platform={platform}
      isLoading={state.loading}
      hasError={state.error}
      onLoad={api.onLoad}
      onFail={api.onFail}
      onComplete={api.reset}
      connectAccount={data.updateCurrentStage}
      {...getPlatformModalProps(platform)}
    />
  );
};

export default ConnectActivePlatformModal;

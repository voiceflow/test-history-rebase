import { Utils } from '@voiceflow/realtime-sdk';
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

const ConnectActivePlatformModal: React.FC = () => {
  const platform = useSelector(ProjectV2.active.platformV2Selector);
  const { data, isOpened } = useModals<{
    stage: AlexaStageType | GoogleStageType | DialogflowStageType;
    updateCurrentStage: (data: unknown) => void;
  }>(MODAL_TYPE);
  const { stage } = data;

  const [state, api] = useConnectState(isOpened);

  if (Utils.typeGuards.isAlexaPlatform(platform) && stage === AlexaStageType.IDLE) {
    return <AlexaIdleStage modalType={MODAL_TYPE} />;
  }

  if (Utils.typeGuards.isGooglePlatform(platform) && stage === GoogleStageType.IDLE) {
    return <GoogleIdleStage modalType={MODAL_TYPE} />;
  }

  if (Utils.typeGuards.isDialogflowPlatformV2(platform) && stage === DialogflowStageType.IDLE) {
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

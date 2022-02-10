import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { ModalType } from '@/constants';
import { useModals } from '@/hooks';

import BaseConnectPlatformModal from './BaseConnectPlatformModal';
import { useConnectState } from './BaseConnectPlatformModal/hooks';
import { getPlatformModalProps } from './BaseConnectPlatformModal/utils';

const MODAL_TYPE = ModalType.CONNECT_AMAZON;
const PLATFORM_TYPE = VoiceflowConstants.PlatformType.ALEXA;

const ConnectAmazonModal: React.FC = () => {
  const { isOpened, close } = useModals(MODAL_TYPE);

  const [state, api] = useConnectState(isOpened);

  const onComplete = () => {
    api.reset();
    close();
  };

  return (
    <BaseConnectPlatformModal
      modalType={MODAL_TYPE}
      platform={PLATFORM_TYPE}
      isLoading={state.loading}
      hasError={state.error}
      onLoad={api.onLoad}
      onFail={api.onFail}
      onComplete={onComplete}
      {...getPlatformModalProps(PLATFORM_TYPE)}
    />
  );
};

export default ConnectAmazonModal;

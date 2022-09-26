import { Modal } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { AlexaStageType, DialogflowESStageType, GoogleStageType } from '@/constants/platforms';
import * as ProjectV2 from '@/ducks/projectV2';
import { SourceType } from '@/ducks/tracking/constants';
import { useSelector, useTrackingEvents } from '@/hooks';

import manager from '../../../manager';
import { ConnectingStage, IdleStage } from './components';
import { PlatformAccount } from './types';

export interface BaseConnectProps {
  stage?: AlexaStageType | GoogleStageType | DialogflowESStageType;
  source: SourceType;
  platform?: VoiceflowConstants.PlatformType;
}

const IDLE_STAGES = new Set([AlexaStageType.IDLE, GoogleStageType.IDLE, DialogflowESStageType.IDLE]);

const Connect = manager.create<BaseConnectProps, PlatformAccount>(
  'PlatformConnect',
  () =>
    ({ api, type, opened, hidden, animated, platform, source, stage }) => {
      const [trackingEvents] = useTrackingEvents();

      const activePlatform = useSelector(ProjectV2.active.platformSelector);

      const currentPlatform = platform ?? activePlatform;

      const onSuccess = (account: PlatformAccount) => {
        if (source) {
          trackingEvents.trackDeveloperAccountConnected(currentPlatform, source);
        }

        api.resolve(account);
        api.close();
      };

      return (
        <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={392}>
          {stage && IDLE_STAGES.has(stage) ? (
            <IdleStage platform={currentPlatform} />
          ) : (
            <ConnectingStage onClose={() => api.close()} platform={currentPlatform} onSuccess={onSuccess} />
          )}
        </Modal>
      );
    }
);

export default Connect;

import { Utils } from '@voiceflow/realtime-sdk';
import { Modal, toast, usePersistFunction } from '@voiceflow/ui';
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

interface StageMeta {
  title: string;
  projectName: string;
  platformName: string;
  prompt: string;
}

const getStageMeta = Utils.platform.createPlatformSelector<StageMeta>(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: {
      title: 'Connect to Amazon',
      projectName: 'skill to Alexa',
      platformName: 'Alexa',
      prompt: 'Sign in with Amazon to upload your Alexa Skill.',
    },
    [VoiceflowConstants.PlatformType.GOOGLE]: {
      title: 'Connect to Google',
      projectName: 'Action',
      platformName: 'Google',
      prompt: 'Sign in with Google to upload your project.',
    },
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: {
      title: 'Connect to Dialogflow',
      projectName: 'Dialogflow project',
      platformName: 'Dialogflow',
      prompt: 'Sign in with Google to connect this assistant to Dialogflow ES.',
    },
    [VoiceflowConstants.PlatformType.DIALOGFLOW_CX]: {
      title: 'Connect to Dialogflow',
      projectName: 'Dialogflow project',
      platformName: 'Dialogflow',
      prompt: 'Sign in with Google to connect this assistant to Dialogflow CX.',
    },
  },
  {
    title: 'Connect to Project',
    projectName: 'Voiceflow project',
    platformName: 'Voiceflow',
    prompt: 'Sign in with Voiceflow to upload your project.',
  }
);

const Connect = manager.create<BaseConnectProps, PlatformAccount>(
  'PlatformConnect',
  () =>
    ({ api, type, opened, hidden, animated, platform, source, stage }) => {
      const [trackingEvents] = useTrackingEvents();

      const activePlatform = useSelector(ProjectV2.active.platformSelector);

      const currentPlatform = platform ?? activePlatform;

      const stageMeta = getStageMeta(currentPlatform);

      const onSuccess = usePersistFunction((account: PlatformAccount) => {
        if (source) {
          trackingEvents.trackDeveloperAccountConnected(currentPlatform, source);
        }

        toast.success(`${stageMeta.platformName} successfully connected`);
        api.resolve(account);
        api.close();
      });

      return (
        <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={392}>
          {stage && IDLE_STAGES.has(stage) ? (
            <IdleStage platform={currentPlatform} />
          ) : (
            <ConnectingStage {...stageMeta} onClose={() => api.close()} platform={currentPlatform} onSuccess={onSuccess} />
          )}
        </Modal>
      );
    }
);

export default Connect;

import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { SourceType } from '@/ducks/tracking/constants';
import * as ModalsV2 from '@/ModalsV2';
import { AlexaPublishJob } from '@/models';
import { StageComponentProps } from '@/platforms/types';

const WaitAccountStage: React.FC<StageComponentProps<AlexaPublishJob.WaitAccountStage>> = ({ restart, cancel }) => {
  const connectAmazonModal = ModalsV2.useModal(ModalsV2.Platform.Connect);

  React.useEffect(() => {
    connectAmazonModal
      .open({ source: SourceType.ACCOUNT_PAGE, platform: VoiceflowConstants.PlatformType.ALEXA })
      .then(() => restart())
      .catch(() => cancel());

    return () => {
      connectAmazonModal.close();
    };
  }, []);

  return null;
};

export default WaitAccountStage;

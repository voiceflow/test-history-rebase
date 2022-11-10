import * as Platform from '@voiceflow/platform-config';
import React from 'react';

import { SourceType } from '@/ducks/tracking/constants';
import * as ModalsV2 from '@/ModalsV2';
import { AlexaPublishJob } from '@/models';
import { StageComponentProps } from '@/platforms/types';

const WaitAccountStage: React.FC<StageComponentProps<AlexaPublishJob.WaitAccountStage>> = ({ restart, cancel }) => {
  const connectAmazonModal = ModalsV2.useModal(ModalsV2.Platform.Connect);

  React.useEffect(() => {
    connectAmazonModal
      .open({ source: SourceType.ACCOUNT_PAGE, platform: Platform.Constants.PlatformType.ALEXA })
      .then(() => restart())
      .catch(() => cancel());

    return () => {
      connectAmazonModal.remove();
    };
  }, []);

  return null;
};

export default WaitAccountStage;

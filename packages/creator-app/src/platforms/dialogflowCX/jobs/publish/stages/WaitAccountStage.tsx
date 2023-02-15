import * as Platform from '@voiceflow/platform-config';
import React from 'react';

import { SourceType } from '@/ducks/tracking/constants';
import * as ModalsV2 from '@/ModalsV2';
import { DialogflowCXPublishJob } from '@/models';
import { StageComponentProps } from '@/platforms/types';

const WaitAccountStage: React.FC<StageComponentProps<DialogflowCXPublishJob.WaitAccountStage>> = ({ restart, cancel }) => {
  const connectGoogleModal = ModalsV2.useModal(ModalsV2.Platform.Connect);

  React.useEffect(() => {
    connectGoogleModal
      .open({ source: SourceType.ACCOUNT_PAGE, platform: Platform.Constants.PlatformType.DIALOGFLOW_CX })
      .then(() => restart())
      .catch(() => cancel());

    return () => {
      connectGoogleModal.close();
    };
  }, []);

  return null;
};

export default WaitAccountStage;

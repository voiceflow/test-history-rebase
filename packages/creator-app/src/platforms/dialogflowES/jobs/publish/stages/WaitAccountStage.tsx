import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { SourceType } from '@/ducks/tracking/constants';
import * as ModalsV2 from '@/ModalsV2';
import { DialogflowESPublishJob } from '@/models';
import { StageComponentProps } from '@/platforms/types';

const WaitAccountStage: React.FC<StageComponentProps<DialogflowESPublishJob.WaitAccountStage>> = ({ restart, cancel }) => {
  const connectGoogleModal = ModalsV2.useModal(ModalsV2.Platform.Connect);

  React.useEffect(() => {
    connectGoogleModal
      .open({ source: SourceType.ACCOUNT_PAGE, platform: VoiceflowConstants.PlatformType.GOOGLE })
      .then(() => restart())
      .catch(() => cancel());

    return () => {
      connectGoogleModal.close();
    };
  }, []);

  return null;
};

export default WaitAccountStage;

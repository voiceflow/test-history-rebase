import * as Platform from '@voiceflow/platform-config';
import React from 'react';

import { SourceType } from '@/ducks/tracking/constants';
import * as ModalsV2 from '@/ModalsV2';
import { GooglePublishJob } from '@/models';
import { StageComponentProps } from '@/platforms/types';

const WaitAccountStage: React.FC<StageComponentProps<GooglePublishJob.WaitAccountStage>> = ({ restart, cancel }) => {
  const connectModal = ModalsV2.useModal(ModalsV2.Platform.Connect);

  React.useEffect(() => {
    connectModal
      .open({ source: SourceType.ACCOUNT_PAGE, platform: Platform.Constants.PlatformType.GOOGLE })
      .then(() => restart())
      .catch(() => cancel());

    return () => {
      connectModal.remove();
    };
  }, []);

  return null;
};

export default WaitAccountStage;

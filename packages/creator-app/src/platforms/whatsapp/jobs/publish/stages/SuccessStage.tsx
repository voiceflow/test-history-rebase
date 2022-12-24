import { Utils } from '@voiceflow/common';
import { Box, Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { UploadedStage } from '@/components/PlatformUploadPopup/components';
import { WHATSAPP_DOCUMENTATION } from '@/constants/platforms';
import { PrototypeJobContext } from '@/contexts/PrototypeJobContext';
import { useSyncProjectLiveVersion } from '@/hooks/project';
import { NLPTrainJob } from '@/models';
import { StageComponentProps } from '@/platforms/types';
import { openInternalURLInANewTab } from '@/utils/window';

const SuccessStage: React.FC<StageComponentProps<NLPTrainJob.SuccessStage>> = ({ cancel }) => {
  useSyncProjectLiveVersion();

  const prototypeJob = React.useContext(PrototypeJobContext);

  return (
    <UploadedStage description="A new version of your assistant has been published to WhatsApp">
      <Button fullWidth onClick={Utils.functional.chainVoid(prototypeJob?.start, cancel)}>
        Test on WhatsApp
      </Button>
      <Box mt={8} />
      <Button squareRadius fullWidth variant={ButtonVariant.QUATERNARY} onClick={() => openInternalURLInANewTab(WHATSAPP_DOCUMENTATION)}>
        See Documentation
      </Button>
    </UploadedStage>
  );
};

export default SuccessStage;

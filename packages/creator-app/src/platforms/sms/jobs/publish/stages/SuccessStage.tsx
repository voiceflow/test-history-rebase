import { Utils } from '@voiceflow/common';
import { Box, Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { UploadedStage } from '@/components/PlatformUploadPopup/components';
import { SMS_DOCUMENTATION } from '@/constants/platforms';
import { PrototypeJobContext } from '@/contexts/PrototypeJobContext';
import { useSyncProjectLiveVersion } from '@/hooks/project';
import { SMSPublishJob } from '@/models';
import { StageComponentProps } from '@/platforms/types';
import { openInternalURLInANewTab } from '@/utils/window';

const SuccessStage: React.FC<StageComponentProps<SMSPublishJob.SuccessStage>> = ({ cancel }) => {
  useSyncProjectLiveVersion();

  const prototypeJob = React.useContext(PrototypeJobContext);

  return (
    <UploadedStage title="Successfully Published" description="A new version of your assistant has been published to Twilio SMS">
      <Button squareRadius fullWidth onClick={Utils.functional.chainVoid(prototypeJob?.start, cancel)}>
        Test on Phone
      </Button>
      <Box mt={8} />
      <Button squareRadius fullWidth variant={ButtonVariant.QUATERNARY} onClick={() => openInternalURLInANewTab(SMS_DOCUMENTATION)}>
        See Documentation
      </Button>
    </UploadedStage>
  );
};

export default SuccessStage;

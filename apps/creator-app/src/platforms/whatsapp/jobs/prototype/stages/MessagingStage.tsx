import { Box, Link, toast } from '@voiceflow/ui';
import React from 'react';

import { formatPhoneNumber } from '@/components/PhoneInput';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import type { TwilioPrototypeJob } from '@/models';
import type { StageComponentProps } from '@/platforms/types';

const MessagingStage: React.FC<StageComponentProps<TwilioPrototypeJob.MessagingStage>> = ({ stage, cancel }) => {
  const goToSettings = useDispatch(Router.goToActivePlatformPrototype);

  React.useEffect(() => {
    toast.success(
      <Box textAlign="right" width="100%">
        Message sent to {formatPhoneNumber(stage.data.phoneNumber)}
        <Box mt={16}>
          <Link onClick={goToSettings}>Update Number</Link>
        </Box>
      </Box>,
      { autoClose: false }
    );

    return () => {
      cancel();
    };
  }, []);

  return null;
};

export default MessagingStage;

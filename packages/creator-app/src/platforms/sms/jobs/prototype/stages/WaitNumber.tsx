import { ProjectSecretTag } from '@voiceflow/schema-types';
import React from 'react';

import { TwilioPrototypeJob } from '@/models';
import { WaitNumberModal } from '@/platforms/sms/components';
import { StageComponentProps } from '@/platforms/types';

const WaitNumberStage: React.FC<StageComponentProps<TwilioPrototypeJob.WaitNumberStage>> = ({ restart, cancel }) => (
  <WaitNumberModal
    onClose={cancel}
    onSuccess={restart}
    tag={ProjectSecretTag.SMS_PHONE_NUMBER}
    description="You need to have access to the number provided to test from your phone."
  />
);

export default WaitNumberStage;

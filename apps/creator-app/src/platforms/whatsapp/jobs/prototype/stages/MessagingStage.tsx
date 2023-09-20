import { ICustomOptions, toast } from '@voiceflow/ui-next';
import React from 'react';

import { formatPhoneNumber } from '@/components/PhoneInput';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import { TwilioPrototypeJob } from '@/models';
import { StageComponentProps } from '@/platforms/types';

const MessagingStage: React.FC<StageComponentProps<TwilioPrototypeJob.MessagingStage>> = ({ stage, cancel }) => {
  const goToSettings = useDispatch(Router.goToActivePlatformPrototype);

  React.useEffect(() => {
    toast.success(`Message sent to ${formatPhoneNumber(stage.data.phoneNumber)}`, {
      autoClose: false,
      actionButtonProps: { label: 'Update Number', onClick: () => goToSettings() },
    } as ICustomOptions);

    return () => {
      cancel();
    };
  }, []);

  return null;
};

export default MessagingStage;

import { toast } from '@voiceflow/ui';
import React, { useEffect } from 'react';

import { useTrackingEvents } from '@/hooks';
import { NLPTrainJob } from '@/models';
import { StageComponentProps } from '@/platforms/types';

const SuccessStage: React.FC<StageComponentProps<NLPTrainJob.SuccessStage>> = () => {
  const [trackingEvents] = useTrackingEvents();

  useEffect(() => {
    toast.success('Version successfully published.');
    trackingEvents.trackActiveProjectPublishSuccess();
  }, []);

  return null;
};

export default SuccessStage;

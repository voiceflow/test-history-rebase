import { Nullable } from '@voiceflow/common';
import React from 'react';

import client from '@/client';
import { NLPTrainStageType } from '@/constants/platforms';
import useJob, { JobContextValue } from '@/hooks/job';
import { NLPTrainJob } from '@/models';

export const TrainingContext = React.createContext<Nullable<JobContextValue<NLPTrainJob.AnyJob>>>(null);

export const TrainingProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const api = useJob<NLPTrainJob.AnyJob, NLPTrainStageType>(client.platform.general.train);

  return <TrainingContext.Provider value={api}>{children}</TrainingContext.Provider>;
};

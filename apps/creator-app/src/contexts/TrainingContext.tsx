import type { Nullable } from '@voiceflow/common';
import React from 'react';

import client from '@/client';
import type { NLPTrainStageType } from '@/constants/platforms';
import type { JobContextValue } from '@/hooks/job';
import useJob from '@/hooks/job';
import type { NLPTrainJob } from '@/models';

export const TrainingContext = React.createContext<Nullable<JobContextValue<NLPTrainJob.AnyJob>>>(null);
export const { Consumer: NLPConsumer } = TrainingContext;

export const TrainingProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const api = useJob<NLPTrainJob.AnyJob, NLPTrainStageType>(client.platform.general.train);

  return <TrainingContext.Provider value={api}>{children}</TrainingContext.Provider>;
};

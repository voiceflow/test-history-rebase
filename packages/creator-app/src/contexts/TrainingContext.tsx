import { Nullable } from '@voiceflow/common';
import React from 'react';

import client from '@/client';
import { VersionTag } from '@/constants/platforms';
import useJob, { JobContextValue } from '@/hooks/job';
import { JobClient, NLPTrainJob } from '@/models';
import { isRunning } from '@/utils/job';
import logger from '@/utils/logger';

export interface TrainingProviderProps {
  tag: VersionTag;
}

export const TrainingContext = React.createContext<Nullable<JobContextValue<NLPTrainJob.AnyJob> & { active: boolean }>>(null);
export const { Consumer: NLPConsumer } = TrainingContext;

export const TrainingProvider: React.FC<TrainingProviderProps> = ({ tag, children }) => {
  const trainingClient = React.useMemo<JobClient<NLPTrainJob.AnyJob>>(
    () => ({
      run: (projectID, options) => client.platform.general.nlp.run(projectID, { tag, ...options }),
      cancel: (projectID) => client.platform.general.nlp.cancel(projectID, { tag }),
      getStatus: (projectID) => client.platform.general.nlp.getStatus(projectID, { tag }),
      updateStage: async () => {},
    }),
    [tag]
  );

  const api = useJob<NLPTrainJob.AnyJob>(trainingClient);

  const [starting, setStarting] = React.useState(false);

  const start = React.useCallback(async (...args: Parameters<typeof api.start>) => {
    setStarting(true);
    await api.start(...args).catch((err) => logger.error(err));
    setStarting(false);
  }, []);

  const active = starting || isRunning(api.job);

  return <TrainingContext.Provider value={{ ...api, start, active }}>{children}</TrainingContext.Provider>;
};

import { withContext } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import * as ProjectV2 from '@/ducks/projectV2';
import type { JobContextValue } from '@/hooks/job';
import useJob from '@/hooks/job';
import type { AlexaPublishJob, DialogflowESPublishJob, GooglePublishJob, Job, JobClient } from '@/models';

export type AnyJob = AlexaPublishJob.AnyJob | GooglePublishJob.AnyJob | DialogflowESPublishJob.AnyJob;
export interface PublishContextValue<T extends Job<any>> extends JobContextValue<T> {
  active: boolean;
}

export const PublishContext = React.createContext<PublishContextValue<Job<any>>>({
  job: null,
  retry: () => Promise.resolve(),
  start: () => Promise.resolve(),
  active: false,
  cancel: () => Promise.resolve(),
  setJob: () => {},
  restart: () => Promise.resolve(),
  updateCurrentStage: () => Promise.resolve(),
});
export const { Consumer: PublishConsumer } = PublishContext;

export const PublishProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const platform = useSelector(ProjectV2.active.platformSelector);

  const platformClient = React.useMemo(() => {
    return client.platform(platform).publish as JobClient<AnyJob>;
  }, [platform]);

  const api = useJob<AnyJob>(platformClient);

  return <PublishContext.Provider value={api}>{children}</PublishContext.Provider>;
};

export const withPublish = withContext(PublishContext, 'publish');

import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { withContext } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import * as ProjectV2 from '@/ducks/projectV2';
import useJob, { JobContextValue } from '@/hooks/job';
import { AlexaPublishJob, DialogflowESPublishJob, GooglePublishJob, Job, JobClient } from '@/models';
import { isRunning } from '@/utils/job';
import logger from '@/utils/logger';

export type AnyJob = AlexaPublishJob.AnyJob | GooglePublishJob.AnyJob | DialogflowESPublishJob.AnyJob;
export interface PublishContextValue<T extends Job<any>> extends JobContextValue<T> {
  active: boolean;
}

export const PublishContext = React.createContext<Nullable<PublishContextValue<Job<any>>>>(null);
export const { Consumer: PublishConsumer } = PublishContext;

export const PublishProvider: React.FC = ({ children }) => {
  const platform = useSelector(ProjectV2.active.platformSelector);

  const platformClient = React.useMemo(() => {
    const isDialogflowPlatform = Realtime.Utils.typeGuards.isDialogflowPlatform(platform);
    if (isDialogflowPlatform) return client.platform.dialogflowES.publish as JobClient<AnyJob>;

    return client.platform(platform).publish as JobClient<AnyJob>;
  }, [platform]);

  const api = useJob<AnyJob>(platformClient);

  const [starting, setStarting] = React.useState(false);

  const start = React.useCallback(async (...args: Parameters<typeof api.start>) => {
    setStarting(true);
    await api.start(...args).catch((err) => logger.error(err));
    setStarting(false);
  }, []);

  const active = starting || isRunning(api.job);

  return <PublishContext.Provider value={{ ...api, start, active }}>{children}</PublishContext.Provider>;
};

export const withPublish = withContext(PublishContext, 'publish');

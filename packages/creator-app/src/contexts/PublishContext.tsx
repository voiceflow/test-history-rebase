import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { withContext } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import * as ProjectV2 from '@/ducks/projectV2';
import useJob, { JobContextValue } from '@/hooks/job';
import { AlexaPublishJob, DialogflowPublishJob, GooglePublishJob, Job, JobClient } from '@/models';

export type AnyJob = AlexaPublishJob.AnyJob | GooglePublishJob.AnyJob | DialogflowPublishJob.AnyJob;
export type PublishContextValue<T extends Job<any>> = JobContextValue<T>;

export const PublishContext = React.createContext<Nullable<JobContextValue<Job<any>>>>(null);
export const { Consumer: PublishConsumer } = PublishContext;

export const PublishProvider: React.FC = ({ children }) => {
  const platform = useSelector(ProjectV2.active.platformSelector);

  const platformClient = React.useMemo(() => {
    const isDialogflowPlatform = Realtime.Utils.typeGuards.isDialogflowPlatform(platform);
    if (isDialogflowPlatform) return client.platform.dialogflow.publish as JobClient<AnyJob>;

    return client.platform(platform).publish as JobClient<AnyJob>;
  }, [platform]);

  const api = useJob<AnyJob>(platformClient);

  return <PublishContext.Provider value={api}>{children}</PublishContext.Provider>;
};

export const withPublish = withContext(PublishContext, 'publish');

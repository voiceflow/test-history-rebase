import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { withContext } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import * as ProjectV2 from '@/ducks/projectV2';
import { useFeature } from '@/hooks/feature';
import useJob, { JobContextValue } from '@/hooks/job';
import { AlexaPublishJob, DialogflowESPublishJob, GooglePublishJob, Job, JobClient } from '@/models';

export type AnyJob = AlexaPublishJob.AnyJob | GooglePublishJob.AnyJob | DialogflowESPublishJob.AnyJob;
export interface PublishContextValue<T extends Job<any>> extends JobContextValue<T> {
  active: boolean;
}

export const PublishContext = React.createContext<Nullable<PublishContextValue<Job<any>>>>(null);
export const { Consumer: PublishConsumer } = PublishContext;

export const PublishProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const { isEnabled: isProjectAPIImprovementsEnabled } = useFeature(Realtime.FeatureFlag.PROJECT_API_IMPROVEMENTS);

  const platformClient = React.useMemo(() => {
    const isDialogflowPlatform = Realtime.Utils.typeGuards.isDialogflowPlatform(platform);
    const isDialogflowCXPlatform = Realtime.Utils.typeGuards.isDialogflowCXPlatform(platform);

    // TODO: Remove it after project api improvements ff is removed
    if (isDialogflowCXPlatform && !isProjectAPIImprovementsEnabled) {
      return client.platform.dialogflowCX.legacyPublish as unknown as JobClient<AnyJob>;
    }

    if (isDialogflowPlatform) return client.platform.dialogflowES.publish as JobClient<AnyJob>;

    return client.platform(platform).publish as JobClient<AnyJob>;
  }, [platform]);

  const api = useJob<AnyJob>(platformClient);

  return <PublishContext.Provider value={api}>{children}</PublishContext.Provider>;
};

export const withPublish = withContext(PublishContext, 'publish');

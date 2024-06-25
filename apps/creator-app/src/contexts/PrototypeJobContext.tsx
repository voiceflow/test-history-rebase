import type { Nullable } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import React from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import * as ProjectV2 from '@/ducks/projectV2';
import type { JobContextValue } from '@/hooks/job';
import useJob from '@/hooks/job';
import type { Job, TwilioPrototypeJob } from '@/models';

export type AnyPrototypeJob = TwilioPrototypeJob.AnyJob;

export const PrototypeJobContext = React.createContext<Nullable<JobContextValue<Job<any>>>>(null);
export const { Consumer: PrototypeJobConsumer } = PrototypeJobContext;

export const PrototypeJobProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const platform = useSelector(ProjectV2.active.platformSelector);

  const platformClient = React.useMemo(() => {
    switch (platform) {
      case Platform.Constants.PlatformType.WHATSAPP:
        return client.platform.whatsapp.prototype;
      case Platform.Constants.PlatformType.SMS:
        return client.platform.sms.prototype;
      default:
        return undefined;
    }
  }, [platform]);

  const api = useJob<AnyPrototypeJob, any>(platformClient);

  return <PrototypeJobContext.Provider value={platformClient ? api : null}>{children}</PrototypeJobContext.Provider>;
};

import { Nullable } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { withContext } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import * as ProjectV2 from '@/ducks/projectV2';
import useJob, { JobContextValue } from '@/hooks/job';
import { AlexaPublishJob, DialogflowESPublishJob, GeneralExportJob, GooglePublishJob, Job, JobClient } from '@/models';

type AnyExportJob =
  | AlexaPublishJob.AnyJob
  | GooglePublishJob.AnyJob
  | DialogflowESPublishJob.AnyJob
  | GeneralExportJob.AnyJob;

export const ExportContext = React.createContext<Nullable<JobContextValue<Job<any>>>>(null);
export const { Consumer: ExportConsumer } = ExportContext;

export const ExportProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const platform = useSelector(ProjectV2.active.platformSelector);

  const platformClient = (client.platform(platform).export ??
    client.platform(Platform.Constants.PlatformType.VOICEFLOW).export) as JobClient<AnyExportJob>;

  const api = useJob<AnyExportJob>(platformClient);

  return <ExportContext.Provider value={api}>{children}</ExportContext.Provider>;
};

export const withExport = withContext(ExportContext, 'export');

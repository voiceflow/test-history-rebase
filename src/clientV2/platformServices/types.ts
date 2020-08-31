import { Project } from '@voiceflow/api-sdk';

import { Job } from '@/models';
import { Nullable } from '@/types';

type GeneralProject = Project<Record<string, unknown>, Record<string, unknown>>;

export interface PublishService<J extends Job, S extends string> {
  publish: (projectID: string) => Promise<{ job: J; projectID: string }>;

  cancelPublish: (projectID: string) => Promise<void>;

  getPublishStatus: (projectID: string) => Promise<Nullable<J>>;

  updatePublishStage: (projectID: string, stage: S, data: unknown) => Promise<void>;

  copyProject: (projectID: string, data?: Partial<GeneralProject>) => Promise<GeneralProject>;
}

import { Job } from '@/models';
import { Nullable } from '@/types';

export interface PlatformService<J extends Job, S extends string> {
  publish: (projectID: string) => Promise<{ job: J; projectID: string }>;

  cancelPublish: (projectID: string) => Promise<void>;

  getPublishStatus: (projectID: string) => Promise<Nullable<J>>;

  updatePublishStage: (projectID: string, stage: S, data: unknown) => Promise<void>;
}

import { Job } from '@/models';
import { Nullable } from '@/types';

export interface PublishService<J extends Job, S extends string> {
  publish: (projectID: string) => Promise<{ job: J; projectID: string }>;

  cancelPublish: (projectID: string) => Promise<void>;

  getPublishStatus: (projectID: string) => Promise<Nullable<J>>;

  updatePublishStage: (projectID: string, stage: S, data: unknown) => Promise<void>;
}

export interface ExportService<J extends Job, S extends string> {
  export: (projectID: string) => Promise<{ job: J; projectID: string }>;

  cancelExport: (projectID: string) => Promise<void>;

  getExportStatus: (projectID: string) => Promise<Nullable<J>>;

  updateExportStage: (projectID: string, stage: S, data: unknown) => Promise<void>;
}

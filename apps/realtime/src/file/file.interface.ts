import type { UploadType } from './types';

export interface FileModuleOptions {
  accessKeyID: string;
  secretAccessKey: string;
  defaultMaxFileSizeMB: number;
  region: string;
  endpoint: string;
  format?: string;

  buckets: Record<UploadType, string>;
}

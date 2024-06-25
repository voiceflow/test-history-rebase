import type { Enum } from '@voiceflow/dtos';

export type MulterFile = Express.MulterS3.File;

export const UploadType = {
  IMAGE: 'image',
  BACKUP: 'backup',
  KB_DOCUMENT: 'kb_document',
} as const;

export type UploadType = Enum<typeof UploadType>;

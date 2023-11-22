import { BackupDTO } from '@voiceflow/dtos';
import { z } from 'nestjs-zod/z';

export const FindManyBackupResponse = z.object({
  data: z.array(BackupDTO),
});

export type FindManyBackupResponse = z.infer<typeof FindManyBackupResponse>;

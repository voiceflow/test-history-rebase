import { BackupDTO } from '@voiceflow/dtos';
import { z } from 'nestjs-zod/z';

export const BackupFindManyResponse = z.object({
  data: z.array(BackupDTO),
});

export type BackupFindManyResponse = z.infer<typeof BackupFindManyResponse>;

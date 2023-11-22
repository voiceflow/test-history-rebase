import { z } from 'nestjs-zod/z';

export const CreateBackupRequest = z.object({
  versionID: z.string(),
  name: z.string(),
});

export type CreateBackupRequest = z.infer<typeof CreateBackupRequest>;

import { z } from 'nestjs-zod/z';

export const BackupCreateRequest = z.object({
  versionID: z.string(),
  name: z.string(),
});

export type BackupCreateRequest = z.infer<typeof BackupCreateRequest>;

import { z } from 'nestjs-zod/z';

export const PreviewBackupResponse = z.object({
  versionID: z.string(),
});

export type PreviewBackupResponse = z.infer<typeof PreviewBackupResponse>;

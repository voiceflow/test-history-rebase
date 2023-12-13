import { z } from 'nestjs-zod/z';

export const BackupPreviewResponse = z.object({
  versionID: z.string(),
});

export type BackupPreviewResponse = z.infer<typeof BackupPreviewResponse>;

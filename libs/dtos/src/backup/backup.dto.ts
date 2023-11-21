import { z } from 'zod';

export const BackupDTO = z
  .object({
    id: z.number(),
    name: z.string(),
    s3ObjectRef: z.string(),
    assistantID: z.string(),
    createdByID: z.number(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type Backup = z.infer<typeof BackupDTO>;

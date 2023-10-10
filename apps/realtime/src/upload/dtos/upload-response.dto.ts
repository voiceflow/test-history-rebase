import { z } from 'nestjs-zod/z';

export const UploadResponse = z.object({
  url: z.string(),
});

export type UploadResponse = z.infer<typeof UploadResponse>;

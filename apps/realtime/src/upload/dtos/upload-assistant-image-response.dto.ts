import { z } from 'nestjs-zod/z';

export const UploadAssistantImageResponse = z.object({
  url: z.string(),
  attachmentID: z.string(),
});

export type UploadAssistantImageResponse = z.infer<typeof UploadAssistantImageResponse>;

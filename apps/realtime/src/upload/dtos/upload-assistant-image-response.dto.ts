import { z } from 'zod';

export const UploadAssistantImageResponse = z.object({
  url: z.string(),
  attachmentID: z.string(),
});

export type UploadAssistantImageResponse = z.infer<typeof UploadAssistantImageResponse>;

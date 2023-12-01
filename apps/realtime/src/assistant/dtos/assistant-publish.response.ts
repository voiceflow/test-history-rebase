import { ProjectDTO } from '@voiceflow/dtos';
import { z } from 'zod';

export const AssistantPublishResponse = z.object({
  project: ProjectDTO,
});

export type AssistantPublishResponse = z.infer<typeof AssistantPublishResponse>;

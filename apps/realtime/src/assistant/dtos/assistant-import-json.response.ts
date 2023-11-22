import { AssistantDTO, ProjectDTO } from '@voiceflow/dtos';
import { z } from 'zod';

export const AssistantImportJSONResponse = z.object({
  project: ProjectDTO,
  assistant: AssistantDTO.nullable(),
});

export type AssistantImportJSONResponse = z.infer<typeof AssistantImportJSONResponse>;

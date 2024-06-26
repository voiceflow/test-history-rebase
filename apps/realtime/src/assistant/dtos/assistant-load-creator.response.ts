import {
  AssistantDTO,
  DiagramDTO,
  KnowledgeBaseSettingsDTO,
  ProjectDTO,
  ReferenceDTO,
  ReferenceResourceDTO,
  ThreadCommentDTO,
  ThreadDTO,
  VariableStateDTO,
  VersionDTO,
} from '@voiceflow/dtos';
import { z } from 'zod';

import { ProjectMembershipDTO } from '@/project/dtos/project-membership.dto';

import { AssistantExportCMSResponse } from './assistant-export-cms.response';

export const AssistantLoadCreatorResponse = z
  .object({
    threads: z.array(ThreadDTO),
    version: VersionDTO,
    project: ProjectDTO,
    diagrams: z.array(DiagramDTO),
    assistant: AssistantDTO,
    references: z.array(ReferenceDTO).optional(),
    variableStates: z.array(VariableStateDTO),
    threadComments: z.array(ThreadCommentDTO),
    projectMembership: z.array(ProjectMembershipDTO),
    referenceResources: z.array(ReferenceResourceDTO).optional(),
    knowledgeBaseSettings: KnowledgeBaseSettingsDTO,
    knowledgeBaseDocumentsCount: z.number(),
  })
  .merge(AssistantExportCMSResponse)
  .strict();

export type AssistantLoadCreatorResponse = z.infer<typeof AssistantLoadCreatorResponse>;

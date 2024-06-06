import {
  AssistantDTO,
  DiagramDTO,
  ProjectDTO,
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
    variableStates: z.array(VariableStateDTO),
    threadComments: z.array(ThreadCommentDTO),
    projectMembership: z.array(ProjectMembershipDTO),
  })
  .merge(AssistantExportCMSResponse)
  .strict();

export type AssistantLoadCreatorResponse = z.infer<typeof AssistantLoadCreatorResponse>;

import { z } from 'zod';

import { CMSTabularResourceDTO } from '@/common';

import { WorkflowStatus } from './workflow-status.enum';

export const WorkflowDTO = CMSTabularResourceDTO.extend({
  status: z.nativeEnum(WorkflowStatus).nullable(),
  isStart: z.boolean(),
  diagramID: z.string(),
  assigneeID: z.number().nullable(),
  description: z.string().nullable(),
}).strict();

export type Workflow = z.infer<typeof WorkflowDTO>;

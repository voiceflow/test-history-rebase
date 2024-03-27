import type { ToJSON, ToObject } from '@/types';

import type { WorkflowEntity } from './workflow.entity';

export type WorkflowObject = ToObject<WorkflowEntity>;
export type WorkflowJSON = ToJSON<WorkflowObject>;

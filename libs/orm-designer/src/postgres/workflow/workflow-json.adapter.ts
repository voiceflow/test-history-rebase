import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSTabularJSONAdapter } from '@/postgres/common';

import type { WorkflowJSON, WorkflowObject } from './workflow.interface';

export const WorkflowJSONAdapter = createSmartMultiAdapter<WorkflowObject, WorkflowJSON>(
  PostgresCMSTabularJSONAdapter.fromDB,
  PostgresCMSTabularJSONAdapter.toDB
);

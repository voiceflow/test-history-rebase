import { PostgresCMSTabularORM } from '../common';
import { WorkflowEntity } from './workflow.entity';
import { WorkflowJSONAdapter } from './workflow-json.adapter';

export class WorkflowORM extends PostgresCMSTabularORM<WorkflowEntity> {
  Entity = WorkflowEntity;

  jsonAdapter = WorkflowJSONAdapter;
}

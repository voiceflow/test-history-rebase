/* eslint-disable max-params */
import { Inject, Injectable } from '@nestjs/common';
import { DiagramObject,VersionObject } from '@voiceflow/orm-designer';

import { AttachmentService } from '@/attachment/attachment.service';
import { DiagramService } from '@/diagram/diagram.service';
import { EntityService } from '@/entity/entity.service';
import { FlowService } from '@/flow/flow.service';
import { FolderService } from '@/folder/folder.service';
import { FunctionService } from '@/function/function.service';
import { IntentService } from '@/intent/intent.service';
import { ResponseService } from '@/response/response.service';
import { VariableService } from '@/variable/variable.service';
import { VersionService } from '@/version/version.service';
import { WorkflowService } from '@/workflow/workflow.service';

import { EnvironmentCMSData } from './environment.interface';
@Injectable()
export class EnvironmentAdapter {
  constructor(
    @Inject(VersionService) private readonly version: VersionService,
    @Inject(DiagramService) private readonly diagram: DiagramService,
    @Inject(FlowService) private readonly flow: FlowService,
    @Inject(FolderService) private readonly folder: FolderService,
    @Inject(AttachmentService) private readonly attachment: AttachmentService,
    @Inject(ResponseService) private readonly response: ResponseService,
    @Inject(EntityService) private readonly entity: EntityService,
    @Inject(IntentService) private readonly intent: IntentService,
    @Inject(FunctionService) private readonly functions: FunctionService,
    @Inject(WorkflowService) private readonly workflow: WorkflowService,
    @Inject(VariableService) private readonly variable: VariableService
  ) {}

  toJSONWithSubResources(data: EnvironmentCMSData & { version: VersionObject; diagrams: DiagramObject[] }) {
    return {
      ...this.toJSONCMSData(data),
      version: this.version.toJSON(data.version),
      diagrams: this.diagram.mapToJSON(data.diagrams),
    };
  }

  toJSONCMSData(data: EnvironmentCMSData) {
    return {
      ...this.flow.toJSONWithSubResources(data),
      ...this.entity.toJSONWithSubResources(data),
      ...this.folder.toJSONWithSubResources(data),
      ...this.intent.toJSONWithSubResources(data),
      ...this.workflow.toJSONWithSubResources(data),
      ...this.response.toJSONWithSubResources(data),
      ...this.variable.toJSONWithSubResources(data),
      ...this.attachment.toJSONWithSubResources(data),
      ...this.functions.toJSONWithSubResources(data),
    };
  }
}

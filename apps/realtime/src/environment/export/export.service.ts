/* eslint-disable max-params */
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { UnleashFeatureFlagService } from '@voiceflow/nestjs-common';
import { DiagramObject, VersionObject } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AttachmentService } from '@/attachment/attachment.service';
import { DiagramService } from '@/diagram/diagram.service';
import { DiagramUtil } from '@/diagram/diagram.util';
import { EntityService } from '@/entity/entity.service';
import { FlowService } from '@/flow/flow.service';
import { FolderService } from '@/folder/folder.service';
import { FunctionService } from '@/function/function.service';
import { IntentService } from '@/intent/intent.service';
import { ResponseService } from '@/response/response.service';
import { VariableService } from '@/variable/variable.service';
import { VersionService } from '@/version/version.service';
import { WorkflowService } from '@/workflow/workflow.service';

import { EnvironmentCMSData } from '../environment.interface';
import { EnvironmentRepository } from '../environment.repository';
import { EnvironmentExportDTO } from './dtos/environment-export-data.dto';

@Injectable()
export class EnvironmentExportService {
  constructor(
    @Inject(VersionService) private readonly version: VersionService,
    @Inject(DiagramService) private readonly diagram: DiagramService,
    @Inject(DiagramUtil) private readonly diagramUtil: DiagramUtil,
    @Inject(FlowService) private readonly flow: FlowService,
    @Inject(FolderService) private readonly folder: FolderService,
    @Inject(VariableService) private readonly variable: VariableService,
    @Inject(WorkflowService) private readonly workflow: WorkflowService,
    @Inject(AttachmentService) private readonly attachment: AttachmentService,
    @Inject(ResponseService) private readonly response: ResponseService,
    @Inject(IntentService) private readonly intent: IntentService,
    @Inject(EntityService) private readonly entity: EntityService,
    @Inject(FunctionService) private readonly functions: FunctionService,
    @Inject(UnleashFeatureFlagService) private readonly unleash: UnleashFeatureFlagService,
    @Inject(EnvironmentRepository) private readonly environmentRepository: EnvironmentRepository
  ) {}

  public prepareExportData(
    data: {
      cms: EnvironmentCMSData | null;
      version: VersionObject;
      diagrams: DiagramObject[];
    },
    {
      userID,
      backup,
      workspaceID,
      centerDiagrams = true,
    }: { userID: number; backup?: boolean; workspaceID: number; centerDiagrams?: boolean }
  ): EnvironmentExportDTO {
    const version = this.version.toJSON(data.version);
    const diagrams = this.diagram
      .mapToJSON(data.diagrams)
      .map((diagram) => this.diagramUtil.cleanupNodes(centerDiagrams ? this.diagramUtil.center(diagram) : diagram));

    // Remove stored `variableStateID` to avoid referencing the state from another user
    if (
      version.prototype &&
      Utils.object.isObject(version.prototype) &&
      Utils.object.isObject(version.prototype.settings)
    ) {
      delete version.prototype.settings.variableStateID;
    }

    return {
      version: {
        ...version,
        _version: version?._version ?? 1,
      },

      diagrams: Object.fromEntries(diagrams.map((diagram) => [diagram.diagramID, diagram])),

      ...(data.cms && this.prepareExportCMSData(data.cms, { userID, backup, workspaceID })),
    };
  }

  public async exportJSON(environmentID: string) {
    const [cms, { version, diagrams }] = await Promise.all([
      this.environmentRepository.findOneCMSData(environmentID),
      this.version.exportOne(environmentID),
    ]);

    return {
      cms,
      version,
      diagrams,
    };
  }

  public prepareExportCMSData(
    data: EnvironmentCMSData,
    { userID, backup, workspaceID }: { userID: number; backup?: boolean; workspaceID: number }
  ) {
    const cmsFunctionsEnabled = this.unleash.isEnabled(Realtime.FeatureFlag.CMS_FUNCTIONS, { userID, workspaceID });

    return {
      ...this.flow.prepareExportData(data, { backup }),
      ...this.entity.prepareExportData(data, { backup }),
      ...this.intent.prepareExportData(data, { backup }),
      ...this.folder.prepareExportData(data, { backup }),
      ...this.response.prepareExportData(data, { backup }),
      ...this.variable.prepareExportData(data, { backup }),
      ...this.workflow.prepareExportData(data, { backup }),
      ...this.attachment.prepareExportData(data, { backup }),

      ...(cmsFunctionsEnabled && this.functions.prepareExportData(data, { backup })),
    };
  }
}

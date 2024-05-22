/* eslint-disable max-params */
import { Inject, Injectable } from '@nestjs/common';
import { VersionPrototype } from '@voiceflow/dtos';
import { UnleashFeatureFlagService } from '@voiceflow/nestjs-common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { ObjectId } from 'bson';

import { AttachmentService } from '@/attachment/attachment.service';
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

import { EnvironmentCMSExportImportDataDTO } from './dtos/environment-cms-export-import-data.dto';
import { EnvironmentImportDTO } from './dtos/environment-import-data.dto';

@Injectable()
export class EnvironmentImportService {
  constructor(
    @Inject(FolderService) private readonly folder: FolderService,
    @Inject(AttachmentService) private readonly attachment: AttachmentService,
    @Inject(ResponseService) private readonly response: ResponseService,
    @Inject(EntityService) private readonly entity: EntityService,
    @Inject(IntentService) private readonly intent: IntentService,
    @Inject(FunctionService) private readonly functions: FunctionService,
    @Inject(WorkflowService) private readonly workflow: WorkflowService,
    @Inject(VariableService) private readonly variable: VariableService,
    @Inject(VersionService) private readonly version: VersionService,
    @Inject(FlowService) private readonly flow: FlowService,
    @Inject(DiagramUtil) private readonly diagramUtil: DiagramUtil,
    @Inject(UnleashFeatureFlagService) private readonly unleash: UnleashFeatureFlagService
  ) {}

  prepareImportData(
    data: EnvironmentImportDTO,
    {
      userID,
      backup,
      assistantID,
      workspaceID,
      environmentID,
      centerDiagrams,
    }: {
      userID: number;
      backup?: boolean;
      workspaceID: number;
      assistantID: string;
      environmentID: string;
      centerDiagrams?: boolean;
    }
  ) {
    const createdAt = new Date().toJSON();

    const version = {
      ...data.version,
      updatedAt: backup ? data.version.updatedAt ?? new ObjectId(data.version._id).getTimestamp().toJSON() : createdAt,
      prototype: data.version.prototype as VersionPrototype | undefined,
    };

    if (version.prototype?.settings) {
      delete version.prototype.settings.variableStateID;
    }

    const diagrams = Object.values(data.diagrams).map((diagram) => {
      const newDiagram = { ...diagram, diagramID: diagram.diagramID ?? diagram._id };

      return centerDiagrams ? this.diagramUtil.center(newDiagram) : newDiagram;
    });

    const cmsData = this.prepareImportCMSData(data, { userID, backup, assistantID, workspaceID, environmentID });

    return {
      ...cmsData,
      version,
      diagrams,
    };
  }

  public async importJSON({
    data,
    userID,
    assistantID,
    environmentID,
  }: {
    data: ReturnType<EnvironmentImportService['prepareImportData']>;
    userID: number;
    assistantID: string;
    environmentID: string;
  }) {
    const { version, diagrams } = await this.version.importOneJSON({
      sourceVersion: data.version,
      sourceDiagrams: data.diagrams,
      sourceVersionOverride: { _id: environmentID, projectID: assistantID, creatorID: userID },
    });

    await this.importCMSData(data);

    return {
      version,
      diagrams,
    };
  }

  prepareImportCMSData(
    cms: EnvironmentCMSExportImportDataDTO,
    {
      userID,
      backup,
      workspaceID,
      assistantID,
      environmentID,
    }: { userID: number; backup?: boolean; workspaceID: number; assistantID: string; environmentID: string }
  ) {
    const cmsFunctionsEnabled = this.unleash.isEnabled(Realtime.FeatureFlag.CMS_FUNCTIONS, { userID, workspaceID });
    const cmsWorkflowsEnabled = this.unleash.isEnabled(Realtime.FeatureFlag.CMS_WORKFLOWS, { userID, workspaceID });

    const prepareDataContext = { userID, backup, assistantID, environmentID };

    return {
      ...(cms.flows && this.flow.prepareImportData({ flows: cms.flows }, prepareDataContext)),

      ...(cms.folders && this.folder.prepareImportData({ folders: cms.folders }, prepareDataContext)),

      ...(cms.variables && this.variable.prepareImportData({ variables: cms.variables }, prepareDataContext)),

      ...(cms.attachments &&
        cms.cardButtons &&
        this.attachment.prepareImportData(
          { attachments: cms.attachments, cardButtons: cms.cardButtons },
          prepareDataContext
        )),

      ...(cms.entities &&
        cms.entityVariants &&
        this.entity.prepareImportData(
          { entities: cms.entities, entityVariants: cms.entityVariants },
          prepareDataContext
        )),

      ...(cms.intents &&
        cms.utterances &&
        cms.requiredEntities &&
        this.intent.prepareImportData(
          { intents: cms.intents, utterances: cms.utterances, requiredEntities: cms.requiredEntities },
          prepareDataContext
        )),

      ...(cms.responses &&
        cms.responseVariants &&
        cms.responseAttachments &&
        cms.responseDiscriminators &&
        this.response.prepareImportData(
          {
            responses: cms.responses,
            responseVariants: cms.responseVariants,
            responseAttachments: cms.responseAttachments,
            responseDiscriminators: cms.responseDiscriminators,
          },
          prepareDataContext
        )),

      ...(cmsFunctionsEnabled &&
        cms.functions &&
        cms.functionPaths &&
        cms.functionVariables &&
        this.functions.prepareImportData(
          { functions: cms.functions, functionPaths: cms.functionPaths, functionVariables: cms.functionVariables },
          prepareDataContext
        )),

      ...(cmsWorkflowsEnabled &&
        cms.workflows &&
        this.workflow.prepareImportData({ workflows: cms.workflows }, prepareDataContext)),
    };
  }

  async importCMSData(importData: ReturnType<EnvironmentImportService['prepareImportCMSData']>) {
    const {
      attachments,
      cardButtons = [],
      folders,
      responses,
      responseAttachments = [],
      responseDiscriminators = [],
      responseVariants = [],
      entities,
      entityVariants = [],
      intents,
      utterances = [],
      requiredEntities = [],
      functions,
      functionPaths = [],
      functionVariables = [],
      variables,
      flows,
      workflows,
    } = importData;

    if (folders?.length) await this.folder.importManyWithSubResourcesFromJSON({ folders });

    if (attachments?.length) await this.attachment.importManyWithSubResourcesFromJSON({ attachments, cardButtons });

    if (responses?.length)
      await this.response.importManyWithSubResourcesFromJSON({
        responses,
        responseAttachments,
        responseDiscriminators,
        responseVariants,
      });

    if (entities?.length) await this.entity.importManyWithSubResourcesFromJSON({ entities, entityVariants });

    if (intents?.length)
      await this.intent.importManyWithSubResourcesFromJSON({ intents, utterances, requiredEntities });

    if (functions?.length)
      await this.functions.importManyWithSubResourcesFromJSON({ functions, functionPaths, functionVariables });

    if (variables?.length) await this.variable.importManyWithSubResourcesFromJSON({ variables });

    if (flows?.length) await this.flow.importManyWithSubResourcesFromJSON({ flows });

    if (workflows?.length) await this.workflow.importManyWithSubResourcesFromJSON({ workflows });
  }
}

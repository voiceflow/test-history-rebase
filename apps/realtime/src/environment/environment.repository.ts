/* eslint-disable max-params */
import { Inject, Injectable } from '@nestjs/common';

import { AttachmentService } from '@/attachment/attachment.service';
import { DiagramService } from '@/diagram/diagram.service';
import { EntityService } from '@/entity/entity.service';
import { FlowService } from '@/flow/flow.service';
import { FolderService } from '@/folder/folder.service';
import { FunctionService } from '@/function/function.service';
import { IntentService } from '@/intent/intent.service';
import { ProjectService } from '@/project/project.service';
import { ReferenceService } from '@/reference/reference.service';
import { ResponseRepository } from '@/response/response.repository';
import { VariableService } from '@/variable/variable.service';
import { VersionService } from '@/version/version.service';
import { WorkflowService } from '@/workflow/workflow.service';

@Injectable()
export class EnvironmentRepository {
  constructor(
    @Inject(FlowService)
    private readonly flow: FlowService,
    @Inject(FolderService)
    private readonly folder: FolderService,
    @Inject(IntentService)
    private readonly intent: IntentService,
    @Inject(EntityService)
    private readonly entity: EntityService,
    @Inject(DiagramService)
    private readonly diagram: DiagramService,
    @Inject(ProjectService)
    private readonly project: ProjectService,
    @Inject(VersionService)
    private readonly version: VersionService,
    @Inject(VariableService)
    private readonly variable: VariableService,
    @Inject(WorkflowService)
    private readonly workflow: WorkflowService,
    @Inject(ResponseRepository)
    private readonly response: ResponseRepository,
    @Inject(FunctionService)
    private readonly functions: FunctionService,
    @Inject(ReferenceService)
    private readonly reference: ReferenceService,
    @Inject(AttachmentService)
    private readonly attachment: AttachmentService
  ) {}

  async findManyForAssistantID(assistantID: string) {
    const project = await this.project.findOneOrFailWithFields(assistantID, [
      'liveVersion',
      'devVersion',
      'previewVersion',
    ]);

    const tagsMap: Record<string, 'production' | 'development' | 'preview'> = {};

    if (project.devVersion) tagsMap[project.devVersion.toJSON()] = 'development';
    if (project.liveVersion) tagsMap[project.liveVersion.toJSON()] = 'production';
    if (project.previewVersion) tagsMap[project.previewVersion.toJSON()] = 'preview';

    const versions = await this.version.findManyWithFields(Object.keys(tagsMap), [
      '_id',
      'name',
      'creatorID',
      'updatedAt',
    ]);

    return versions.map((version) => {
      const tag = tagsMap[version._id.toJSON()];

      return {
        tag,
        environment: this.version.toJSON({ ...version, name: tag === 'development' ? 'Development' : version.name }),
      };
    });
  }

  async findOneCMSDataToMigrate(environmentID: string) {
    const [{ variables }] = await Promise.all([this.variable.findManyWithSubResourcesByEnvironment(environmentID)]);

    return {
      variables,
    };
  }

  async deleteOneCMSData(environmentID: string) {
    // needs to be done in multiple operations to avoid locks in reference tables
    await Promise.all([
      this.flow.deleteManyByEnvironment(environmentID),
      this.intent.deleteManyByEnvironment(environmentID),
      this.workflow.deleteManyByEnvironment(environmentID),
      this.functions.deleteManyByEnvironment(environmentID),
    ]);

    await Promise.all([
      this.entity.deleteManyByEnvironment(environmentID),
      this.response.deleteManyByEnvironment(environmentID),
      this.variable.deleteManyByEnvironment(environmentID),
    ]);

    await Promise.all([
      this.folder.deleteManyByEnvironment(environmentID),
      this.attachment.deleteManyByEnvironment(environmentID),
    ]);
  }

  async deleteOne(environmentID: string) {
    await Promise.all([
      this.deleteOneCMSData(environmentID),
      this.version.deleteOne(environmentID),
      this.diagram.deleteManyByVersionID(environmentID),
      this.reference.cleanupByEnvironmentID(environmentID),
    ]);
  }

  async findOneCMSData(environmentID: string) {
    const [
      { flows },
      { entities, entityVariants },
      { intents, utterances, requiredEntities },
      { folders },
      { variables },
      { workflows },
      { responses, responseVariants, responseMessages, responseAttachments, responseDiscriminators },
      { attachments, cardButtons },
      { functions, functionPaths, functionVariables },
    ] = await Promise.all([
      this.flow.findManyWithSubResourcesByEnvironment(environmentID),
      this.entity.findManyWithSubResourcesByEnvironment(environmentID),
      this.intent.findManyWithSubResourcesByEnvironment(environmentID),
      this.folder.findManyWithSubResourcesByEnvironment(environmentID),
      this.variable.findManyWithSubResourcesByEnvironment(environmentID),
      this.workflow.findManyWithSubResourcesByEnvironment(environmentID),
      this.response.findManyWithSubResourcesByEnvironment(environmentID),
      this.attachment.findManyWithSubResourcesByEnvironment(environmentID),
      this.functions.findManyWithSubResourcesByEnvironment(environmentID),
    ]);

    return {
      flows,
      folders,
      intents,
      entities,
      functions,
      responses,
      variables,
      workflows,
      utterances,
      attachments,
      cardButtons,
      functionPaths,
      entityVariants,
      requiredEntities,
      responseVariants,
      responseMessages,
      functionVariables,
      responseAttachments,
      responseDiscriminators,
    };
  }
}

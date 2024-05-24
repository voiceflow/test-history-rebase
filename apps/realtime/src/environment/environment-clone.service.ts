/* eslint-disable max-params */
import { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { DatabaseTarget, VersionJSON } from '@voiceflow/orm-designer';
import { Merge } from 'type-fest';

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

import { EnvironmentRepository } from './environment.repository';

@Injectable()
export class EnvironmentCloneService {
  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(FlowService) private readonly flow: FlowService,
    @Inject(FolderService) private readonly folder: FolderService,
    @Inject(VariableService) private readonly variable: VariableService,
    @Inject(WorkflowService) private readonly workflow: WorkflowService,
    @Inject(AttachmentService) private readonly attachment: AttachmentService,
    @Inject(ResponseService) private readonly response: ResponseService,
    @Inject(IntentService) private readonly intent: IntentService,
    @Inject(EntityService) private readonly entity: EntityService,
    @Inject(FunctionService) private readonly functions: FunctionService,
    @Inject(EnvironmentRepository) private readonly environmentRepository: EnvironmentRepository,
    @Inject(VersionService) private readonly version: VersionService,
    @Inject(DiagramService) private readonly diagram: DiagramService
  ) {}

  public async cloneCMSData(data: {
    sourceAssistantID: string;
    targetAssistantID: any;
    sourceEnvironmentID: string;
    targetEnvironmentID: any;
  }) {
    const { flows } = await this.flow.cloneManyWithSubResourcesForEnvironment(data);
    const { folders } = await this.folder.cloneManyWithSubResourcesForEnvironment(data);
    const { variables } = await this.variable.cloneManyWithSubResourcesForEnvironment(data);
    const { workflows } = await this.workflow.cloneManyWithSubResourcesForEnvironment(data);
    const { attachments, cardButtons } = await this.attachment.cloneManyWithSubResourcesForEnvironment(data);
    const { responses, responseVariants, responseAttachments, responseDiscriminators } =
      await this.response.cloneManyWithSubResourcesForEnvironment(data);
    const { entities, entityVariants } = await this.entity.cloneManyWithSubResourcesForEnvironment(data);
    const { intents, utterances, requiredEntities } = await this.intent.cloneManyWithSubResourcesForEnvironment(data);
    const { functions, functionPaths, functionVariables } =
      await this.functions.cloneManyWithSubResourcesForEnvironment(data);

    return {
      flows,
      intents,
      folders,
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
      functionVariables,
      responseAttachments,
      responseDiscriminators,
    };
  }

  async cloneOne({
    sourceEnvironmentID,
    targetEnvironmentID,
    targetVersionOverride = {},
  }: {
    sourceEnvironmentID: string;
    targetEnvironmentID?: string;
    targetVersionOverride?: Merge<Partial<Omit<VersionJSON, '_id' | 'prototype'>>, { prototype?: any }>;
  }) {
    const [sourceVersion, sourceDiagrams] = await Promise.all([
      this.version.findOneOrFail(sourceEnvironmentID),
      this.diagram.findManyByVersionID(sourceEnvironmentID),

      // clear existing data before cloning
      targetEnvironmentID && this.diagram.deleteManyByVersionID(targetEnvironmentID),
    ]);

    const { version: targetVersion, diagrams: targetDiagrams } = await this.version.importOne({
      sourceVersion: this.version.toJSON(sourceVersion),
      sourceDiagrams: this.diagram.mapToJSON(sourceDiagrams),
      sourceVersionOverride: { ...(targetEnvironmentID && { _id: targetEnvironmentID }), ...targetVersionOverride },
    });

    const cmsCloneManyPayload = {
      sourceAssistantID: sourceVersion.projectID.toJSON(),
      targetAssistantID: targetVersion.projectID.toJSON(),
      sourceEnvironmentID: sourceVersion._id.toJSON(),
      targetEnvironmentID: targetVersion._id.toJSON(),
    };

    const cmsData = await this.postgresEM.transactional(async () => {
      // clear existing data before cloning
      await this.environmentRepository.deleteOneCMSData(cmsCloneManyPayload.targetEnvironmentID);

      const { flows } = await this.flow.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload);
      const { folders } = await this.folder.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload);
      const { variables } = await this.variable.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload);
      const { workflows } = await this.workflow.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload);
      const { attachments, cardButtons } =
        await this.attachment.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload);
      const { responses, responseVariants, responseAttachments, responseDiscriminators } =
        await this.response.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload);
      const { entities, entityVariants } =
        await this.entity.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload);
      const { intents, utterances, requiredEntities } =
        await this.intent.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload);
      const { functions, functionPaths, functionVariables } =
        await this.functions.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload);

      return {
        flows,
        intents,
        folders,
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
        functionVariables,
        responseAttachments,
        responseDiscriminators,
      };
    });

    return {
      ...cmsData,
      version: targetVersion,
      diagrams: targetDiagrams,
      liveDiagramIDs: VersionService.getLiveDiagramIDs(targetVersion, targetDiagrams),
    };
  }
}

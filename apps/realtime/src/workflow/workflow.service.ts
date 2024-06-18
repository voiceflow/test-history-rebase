/* eslint-disable max-params */
import type { EntityManager, Primary } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { Workflow } from '@voiceflow/dtos';
import { HashedIDService } from '@voiceflow/nestjs-common';
import { LoguxService } from '@voiceflow/nestjs-logux';
import type {
  DiagramObject,
  ORMEntity,
  PatchData,
  ReferenceObject,
  ReferenceResourceObject,
  WorkflowJSON,
  WorkflowObject,
} from '@voiceflow/orm-designer';
import { AssistantORM, DatabaseTarget, WorkflowORM } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { IdentityClient } from '@voiceflow/sdk-identity';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSTabularService } from '@/common';
import { cmsBroadcastContext, toPostgresEntityIDs } from '@/common/utils';
import { CreatorAppService } from '@/creator-app/creator-app.service';
import { DiagramService } from '@/diagram/diagram.service';
import { DiagramUtil } from '@/diagram/diagram.util';
import { EmailService } from '@/email/email.service';
import { EmailSubscriptionGroup } from '@/email/enum/email-subscription-group.enum';
import { EmailTemplate } from '@/email/enum/email-template.enum';
import { ReferenceService } from '@/reference/reference.service';
import { CMSBroadcastMeta, CMSContext } from '@/types';

import type { WorkflowExportImportDataDTO } from './dtos/workflow-export-import-data.dto';
import type { WorkflowCreateData } from './workflow.interface';

@Injectable()
export class WorkflowService extends CMSTabularService<WorkflowORM> {
  private readonly logger: Logger = new Logger(WorkflowService.name);

  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    protected readonly postgresEM: EntityManager,
    @Inject(WorkflowORM)
    protected readonly orm: WorkflowORM,
    @Inject(AssistantORM)
    protected readonly assistantORM: AssistantORM,
    @Inject(IdentityClient)
    private readonly identity: IdentityClient,
    @Inject(EmailService)
    protected readonly email: EmailService,
    @Inject(LoguxService)
    protected readonly logux: LoguxService,
    @Inject(DiagramService)
    protected readonly diagram: DiagramService,
    @Inject(HashedIDService)
    protected readonly hashedID: HashedIDService,
    @Inject(ReferenceService)
    protected readonly reference: ReferenceService,
    @Inject(CreatorAppService)
    protected readonly creatorApp: CreatorAppService,
    @Inject(DiagramUtil)
    protected readonly diagramUtil: DiagramUtil
  ) {
    super();
  }

  /* Send email */

  async sendEmailToAssignee({
    workflow,
    authorID,
    assigneeID,
  }: {
    workflow: WorkflowObject;
    authorID: number;
    assigneeID?: number | null;
  }) {
    // if assignee is not changed or not set - do not send email
    if (!assigneeID || assigneeID === workflow.assigneeID) return;

    try {
      const [author, assignee, assistant] = await Promise.all([
        this.identity.private.findUserByID(authorID),
        this.identity.private.findUserByID(assigneeID),
        this.assistantORM.findOneOrFail(workflow.assistantID),
      ]);

      await this.email.sendNotifications(assignee.email, EmailTemplate.WORKFLOW_ASSIGNED, {
        asm: {
          groupId: EmailSubscriptionGroup.PROJECT_ACTIVITY,
          groupsToDisplay: [EmailSubscriptionGroup.PROJECT_ACTIVITY],
        },
        dynamicTemplateData: {
          inviter: author.name,
          project_name: assistant.name,
          project_link: this.creatorApp.getCanvasURL({
            versionID: workflow.environmentID,
            diagramID: workflow.diagramID,
          }),
          workflow_name: workflow.name,
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  /* Update */

  async patchOneForUserAndSendEmail(
    userID: number,
    id: Primary<ORMEntity<WorkflowORM>>,
    data: PatchData<ORMEntity<WorkflowORM>>
  ) {
    const workflow = await (data.assigneeID ? this.findOneOrFail(id) : Promise.resolve(null));

    await this.orm.patchOneForUser(userID, id, data);

    if (workflow) {
      this.sendEmailToAssignee({ workflow, authorID: userID, assigneeID: data.assigneeID });
    }
  }

  async patchManyForUserAndSendEmail(
    userID: number,
    ids: Primary<ORMEntity<WorkflowORM>>[],
    data: PatchData<ORMEntity<WorkflowORM>>
  ) {
    const workflows = await (data.assigneeID ? this.findMany(ids) : Promise.resolve([]));

    await this.orm.patchManyForUser(userID, ids, data);

    if (workflows.length) {
      workflows.map((workflow) =>
        this.sendEmailToAssignee({ workflow, authorID: userID, assigneeID: data.assigneeID })
      );
    }
  }

  async updateOneByDiagramIDAndBroadcast(diagramID: string, patch: { updatedByID: number }, meta: CMSBroadcastMeta) {
    const workflowID = await this.orm.updateOneByDiagramIDAndReturnID(meta.context.environmentID, diagramID, patch);

    // workflow was not found
    if (workflowID === null) return;

    await this.logux.processAs(
      Actions.Workflow.PatchOne({
        id: workflowID,
        patch: Utils.object.omit(patch, ['updatedByID']),
        context: cmsBroadcastContext(meta.context),
      }),
      meta.auth
    );
  }

  /* Find */

  async findManyWithSubResourcesByEnvironment(environmentID: string) {
    const workflows = await this.findManyByEnvironment(environmentID);

    return {
      workflows,
    };
  }

  /* Export */

  toJSONWithSubResources({ workflows }: { workflows: WorkflowObject[] }) {
    return {
      workflows: this.mapToJSON(workflows),
    };
  }

  fromJSONWithSubResources({ workflows }: WorkflowExportImportDataDTO) {
    return {
      workflows: this.mapFromJSON(workflows),
    };
  }

  prepareExportData(
    data: { workflows: WorkflowObject[] },
    { backup }: { backup?: boolean } = {}
  ): WorkflowExportImportDataDTO {
    const json = this.toJSONWithSubResources(data);

    if (backup) {
      return json;
    }

    return {
      workflows: json.workflows.map((item) => Utils.object.omit(item, ['assistantID', 'environmentID'])),
    };
  }

  /* Clone */

  async cloneManyWithSubResourcesForEnvironment({
    targetAssistantID,
    sourceEnvironmentID,
    targetEnvironmentID,
  }: {
    targetAssistantID: string;
    sourceEnvironmentID: string;
    targetEnvironmentID: string;
  }) {
    const { workflows: sourceWorkflows } = await this.findManyWithSubResourcesByEnvironment(sourceEnvironmentID);

    return this.importManyWithSubResources({
      workflows: sourceWorkflows.map((flow) => ({
        ...flow,
        assistantID: targetAssistantID,
        environmentID: targetEnvironmentID,
      })),
    });
  }

  /* Import */

  prepareImportData(
    { workflows }: WorkflowExportImportDataDTO,
    {
      userID,
      backup,
      assistantID,
      environmentID,
    }: { userID: number; backup?: boolean; assistantID: string; environmentID: string }
  ): { workflows: WorkflowJSON[] } {
    const createdAt = new Date().toJSON();

    if (backup) {
      return {
        workflows: workflows.map((item) => ({
          ...item,
          assistantID,
          environmentID,
        })),
      };
    }

    return {
      workflows: workflows.map((item) => ({
        ...item,
        createdAt,
        updatedAt: createdAt,
        assigneeID: null,
        createdByID: userID,
        updatedByID: userID,
        assistantID,
        environmentID,
      })),
    };
  }

  async importManyWithSubResources(data: { workflows: WorkflowObject[] }) {
    const workflows = await this.createMany(data.workflows);

    return {
      workflows,
    };
  }

  async importManyWithSubResourcesFromJSON({ workflows }: WorkflowExportImportDataDTO) {
    await this.importManyWithSubResources(this.fromJSONWithSubResources({ workflows }));
  }

  /* Create */

  async createManyAndSync(data: WorkflowCreateData[], { userID, context }: { userID: number; context: CMSContext }) {
    const diagrams = await this.diagram.createManyTopics(
      data.map(({ name, diagram }) => ({ ...diagram, name })),
      { userID, context }
    );

    const workflows = await this.createManyForUser(
      userID,
      data.map((item, index) => ({
        ...Utils.object.omit(item, ['diagram']),
        diagramID: diagrams[index].diagramID.toJSON(),
        assistantID: context.assistantID,
        environmentID: context.environmentID,
      }))
    );

    const referenceResult = await this.reference.createManyWithSubResourcesAndSyncForDiagrams({
      userID,
      diagrams: this.diagram.mapToJSON(diagrams),
      assistantID: context.assistantID,
      environmentID: context.environmentID,
    });

    return {
      ...referenceResult,
      add: { ...referenceResult.add, workflows, diagrams },
    };
  }

  async broadcastAddMany(
    {
      add,
    }: {
      add: {
        diagrams: DiagramObject[];
        workflows: WorkflowObject[];
        references: ReferenceObject[];
        referenceResources: ReferenceResourceObject[];
      };
    },
    meta: CMSBroadcastMeta
  ) {
    const assistant = await this.assistantORM.findOneOrFail(meta.context.assistantID);

    await Promise.all([
      this.logux.processAs(
        Actions.Workflow.AddMany({
          data: this.mapToJSON(add.workflows),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),
      this.diagram.broadcastAddMany(add.diagrams, {
        ...meta,
        context: { ...meta.context, workspaceID: this.hashedID.encodeWorkspaceID(assistant.workspaceID) },
      }),
      this.reference.broadcastAddMany({ add: Utils.object.pick(add, ['references', 'referenceResources']) }, meta),
    ]);
  }

  async createManyAndBroadcast(data: WorkflowCreateData[], meta: CMSBroadcastMeta) {
    const result = await this.createManyAndSync(data, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastAddMany(result, meta);

    return result.add.workflows.map((workflow, index) => {
      const diagram = result.add.diagrams[index];

      const triggerNode =
        Object.values(diagram.nodes).find((node) => node.type === Realtime.BlockType.TRIGGER) ??
        Object.values(diagram.nodes).find((node) => node.type === Realtime.BlockType.INTENT);

      return { ...workflow, triggerNodeID: triggerNode?.nodeID ?? null };
    });
  }

  /* Delete */

  async collectRelationsToDelete(workflows: WorkflowObject[]) {
    const diagrams = await this.diagram.findMany(
      workflows.map((workflow) => ({ diagramID: workflow.diagramID, versionID: workflow.environmentID }))
    );

    return {
      diagrams,
    };
  }

  async deleteManyAndSync(ids: string[], { userID, context }: { userID: number; context: CMSContext }) {
    const workflows = await this.findManyByEnvironmentAndIDs(context.environmentID, ids);

    const workflowsWithoutStart = workflows.filter((workflow) => !workflow.isStart);
    const diagramIDs = workflowsWithoutStart.map((flow) => flow.diagramID);

    const diagrams = await this.diagram.findManyByVersionIDAndDiagramIDs(context.environmentID, diagramIDs);

    const result = await this.postgresEM.transactional(async () => {
      await this.deleteMany(workflowsWithoutStart);

      const referenceResult = await this.reference.deleteManyWithSubResourcesAndSyncByDiagramIDs({
        userID,
        diagramIDs,
        assistantID: context.assistantID,
        environmentID: context.environmentID,
      });

      return {
        delete: { ...referenceResult.delete, workflows: workflowsWithoutStart, diagrams },
      };
    });

    // removing diagrams outside of transaction caus they are in mongo
    try {
      await this.diagram.deleteManyByVersionIDAndDiagramIDs(context.environmentID, diagramIDs);
    } catch (error) {
      // recreating workflows and references if diagrams were not deleted
      await this.createMany(workflows);

      await this.reference.createManyWithSubResourcesAndSyncForDiagrams({
        userID,
        diagrams: this.diagram.mapToJSON(diagrams),
        assistantID: context.assistantID,
        environmentID: context.environmentID,
      });

      throw error;
    }

    return result;
  }

  async broadcastDeleteMany(
    {
      delete: del,
    }: {
      delete: {
        diagrams: DiagramObject[];
        workflows: WorkflowObject[];
        references: ReferenceObject[];
        referenceResources: ReferenceResourceObject[];
      };
    },
    meta: CMSBroadcastMeta
  ) {
    const assistant = await this.assistantORM.findOneOrFail(meta.context.assistantID);

    await Promise.all([
      this.logux.processAs(
        Actions.Workflow.DeleteMany({
          ids: toPostgresEntityIDs(del.workflows),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),
      this.diagram.broadcastDeleteMany(del.diagrams, {
        ...meta,
        context: {
          ...meta.context,
          workspaceID: this.hashedID.encodeWorkspaceID(assistant.workspaceID),
        },
      }),
      this.reference.broadcastDeleteMany(
        { delete: Utils.object.pick(del, ['references', 'referenceResources']) },
        meta
      ),
    ]);
  }

  async deleteManyAndBroadcast(ids: string[], meta: CMSBroadcastMeta): Promise<void> {
    const result = await this.deleteManyAndSync(ids, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastDeleteMany(result, meta);
  }

  /* Duplicate */

  async duplicateManyAndSync(
    sourceWorkflows: WorkflowObject[],
    {
      userID,
      context,
      sourceEnvironmentID,
    }: {
      userID: number;
      context: CMSContext;
      sourceEnvironmentID?: string;
    }
  ) {
    const sourceDiagrams = await this.diagram.findManyByVersionIDAndDiagramIDs(
      sourceEnvironmentID ?? context.environmentID,
      sourceWorkflows.map((flow) => flow.diagramID)
    );

    const diagrams = await this.diagram.createManyTopics(
      sourceDiagrams.map((diagram, index) => ({
        type: diagram.type,
        zoom: diagram.zoom,
        name: sourceWorkflows[index]?.name ?? diagram.name,
        nodes: this.diagramUtil.removeStartNode(diagram.nodes),
        offsetX: diagram.offsetX,
        offsetY: diagram.offsetY,
        modified: diagram.modified,
        variables: diagram.variables,
      })),
      { userID, context }
    );

    const isNewEnvironment = sourceEnvironmentID && sourceEnvironmentID !== context.environmentID;

    const workflows = await this.createManyForUser(
      userID,
      sourceWorkflows.map(({ name, folderID, description }, index) => ({
        name: isNewEnvironment ? name : `${name} (copy)`,
        isStart: false,
        folderID: isNewEnvironment ? null : folderID,
        diagramID: diagrams[index].diagramID.toJSON(),
        assigneeID: userID,
        description,
        assistantID: context.assistantID,
        environmentID: context.environmentID,
      }))
    );

    const referenceResult = await this.reference.createManyWithSubResourcesAndSyncForDiagrams({
      userID,
      diagrams: this.diagram.mapToJSON(diagrams),
      assistantID: context.assistantID,
      environmentID: context.environmentID,
    });

    return {
      ...referenceResult,
      add: { ...referenceResult.add, diagrams, workflows },
    };
  }

  async copyPasteManyAndBroadcast(data: Actions.Workflow.CopyPasteMany.Request['data'], meta: CMSBroadcastMeta) {
    const sourceWorkflows = await this.orm.findManyByDiagramIDs(data.sourceEnvironmentID, data.sourceDiagramIDs);

    const result = await this.duplicateManyAndSync(sourceWorkflows, {
      userID: meta.auth.userID,
      context: meta.context,
      sourceEnvironmentID: data.sourceEnvironmentID,
    });

    await this.broadcastAddMany(result, meta);

    return result.add.workflows;
  }

  async duplicateOneAndBroadcast(data: { workflowID: string }, meta: CMSBroadcastMeta) {
    const workflow = await this.findOneOrFail({ id: data.workflowID, environmentID: meta.context.environmentID });

    const result = await this.duplicateManyAndSync([workflow], {
      userID: meta.auth.userID,
      context: meta.context,
    });

    await this.broadcastAddMany(result, meta);

    return result.add.workflows[0];
  }

  /* Upsert */

  async upsertManyWithSubResources(
    data: { workflows: Workflow[] },
    meta: { userID: number; assistantID: string; environmentID: string }
  ) {
    const { workflows } = this.prepareImportData(data, meta);

    await this.upsertMany(this.mapFromJSON(workflows));
  }
}

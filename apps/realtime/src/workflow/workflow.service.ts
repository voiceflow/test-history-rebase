/* eslint-disable max-params */
import type { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { Workflow } from '@voiceflow/dtos';
import { HashedIDService } from '@voiceflow/nestjs-common';
import { LoguxService } from '@voiceflow/nestjs-logux';
import type { DiagramObject, WorkflowJSON, WorkflowObject } from '@voiceflow/orm-designer';
import { AssistantORM, DatabaseTarget, WorkflowORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSTabularService } from '@/common';
import { cmsBroadcastContext, toPostgresEntityIDs } from '@/common/utils';
import { DiagramService } from '@/diagram/diagram.service';
import { CMSBroadcastMeta, CMSContext } from '@/types';

import type { WorkflowExportImportDataDTO } from './dtos/workflow-export-import-data.dto';
import type { WorkflowCreateData } from './workflow.interface';

@Injectable()
export class WorkflowService extends CMSTabularService<WorkflowORM> {
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
    @Inject(LoguxService)
    protected readonly logux: LoguxService,
    @Inject(DiagramService)
    protected readonly diagram: DiagramService,
    @Inject(HashedIDService)
    protected readonly hashedID: HashedIDService
  ) {
    super();
  }

  /* Update */

  async updateOneByDiagramIDAndBroadcast(diagramID: string, patch: { updatedByID: number }, meta: CMSBroadcastMeta) {
    const workflowID = await this.orm.updateOneByDiagramIDAndReturnID(meta.context.environmentID, diagramID, patch);

    // workflow was not found
    if (workflowID === null) return;

    await this.logux.processAs(
      Actions.Workflow.PatchOne({
        id: workflowID,
        patch: {},
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

  prepareExportData(data: { workflows: WorkflowObject[] }, { backup }: { backup?: boolean } = {}): WorkflowExportImportDataDTO {
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
      workflows: sourceWorkflows.map((flow) => ({ ...flow, assistantID: targetAssistantID, environmentID: targetEnvironmentID })),
    });
  }

  /* Import */

  prepareImportData(
    { workflows }: WorkflowExportImportDataDTO,
    { userID, backup, assistantID, environmentID }: { userID: number; backup?: boolean; assistantID: string; environmentID: string }
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

  /* Create */

  async createManyAndSync(data: WorkflowCreateData[], { userID, context }: { userID: number; context: CMSContext }) {
    const diagrams = await this.diagram.createManyComponents(
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

    return {
      add: { workflows, diagrams },
    };
  }

  async broadcastAddMany({ add }: { add: { workflows: WorkflowObject[]; diagrams: DiagramObject[] } }, meta: CMSBroadcastMeta) {
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
    ]);
  }

  async createManyAndBroadcast(data: WorkflowCreateData[], meta: CMSBroadcastMeta) {
    const result = await this.createManyAndSync(data, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastAddMany(result, meta);

    return result.add.workflows;
  }

  /* Delete */

  async collectRelationsToDelete(workflows: WorkflowObject[]) {
    const diagrams = await this.diagram.findMany(workflows.map((workflow) => ({ diagramID: workflow.diagramID, versionID: workflow.environmentID })));

    return {
      diagrams,
    };
  }

  async deleteManyAndSync(ids: string[], { context }: { context: CMSContext }) {
    return this.postgresEM.transactional(async () => {
      const workflows = await this.findManyByEnvironmentAndIDs(context.environmentID, ids);

      const diagramIDs = workflows.map((flow) => flow.diagramID);
      const diagrams = await this.diagram.findManyByVersionIDAndDiagramIDs(context.environmentID, diagramIDs);

      await this.diagram.deleteManyByVersionIDAndDiagramIDs(context.environmentID, diagramIDs);
      await this.deleteMany(workflows);

      return {
        delete: { workflows, diagrams },
      };
    });
  }

  async broadcastDeleteMany(
    {
      delete: del,
    }: {
      delete: {
        diagrams: DiagramObject[];
        workflows: WorkflowObject[];
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
    ]);
  }

  async deleteManyAndBroadcast(ids: string[], meta: CMSBroadcastMeta): Promise<void> {
    const result = await this.deleteManyAndSync(ids, meta);

    await this.broadcastDeleteMany(result, meta);
  }

  /* Duplicate */

  async duplicateMany(
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

    const diagrams = await this.diagram.createManyComponents(
      sourceDiagrams.map((diagram, index) => ({
        type: diagram.type,
        zoom: diagram.zoom,
        name: sourceWorkflows[index]?.name ?? diagram.name,
        nodes: diagram.nodes,
        offsetX: diagram.offsetX,
        offsetY: diagram.offsetY,
        modified: diagram.modified,
        variables: diagram.variables,
        menuItems: diagram.menuItems,
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

    return {
      diagrams,
      workflows,
    };
  }

  async copyPasteManyAndBroadcast(data: Actions.Workflow.CopyPasteMany.Request['data'], meta: CMSBroadcastMeta) {
    const sourceWorkflows = await this.orm.findManyByDiagramIDs(data.sourceEnvironmentID, data.sourceDiagramIDs);

    const { workflows, diagrams } = await this.duplicateMany(sourceWorkflows, {
      userID: meta.auth.userID,
      context: meta.context,
      sourceEnvironmentID: data.sourceEnvironmentID,
    });

    await this.broadcastAddMany({ add: { workflows, diagrams } }, meta);

    return workflows;
  }

  async duplicateOneAndBroadcast(data: { workflowID: string }, meta: CMSBroadcastMeta) {
    const workflow = await this.findOneOrFail({ id: data.workflowID, environmentID: meta.context.environmentID });

    const { workflows, diagrams } = await this.duplicateMany([workflow], {
      userID: meta.auth.userID,
      context: meta.context,
    });

    await this.broadcastAddMany({ add: { workflows, diagrams } }, meta);

    return workflow;
  }

  /* Upsert */

  async upsertManyWithSubResources(data: { workflows: Workflow[] }, meta: { userID: number; assistantID: string; environmentID: string }) {
    const { workflows } = this.prepareImportData(data, meta);

    await this.upsertMany(this.mapFromJSON(workflows));
  }
}

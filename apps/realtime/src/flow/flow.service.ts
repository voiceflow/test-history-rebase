/* eslint-disable no-await-in-loop, max-params */
import type { EntityManager } from '@mikro-orm/core';
import { Primary } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { Flow } from '@voiceflow/dtos';
import { HashedIDService } from '@voiceflow/nestjs-common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type { AssistantEntity, DiagramEntity, FlowEntity, ORMMutateOptions, ToJSONWithForeignKeys } from '@voiceflow/orm-designer';
import { AssistantORM, DatabaseTarget, FlowORM, PKOrEntity } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSTabularService, EntitySerializer } from '@/common';
import { assistantBroadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';
import { DiagramService } from '@/diagram/diagram.service';
import { cloneManyEntities } from '@/utils/entity.util';

import type { FlowExportImportDataDTO } from './dtos/flow-export-import-data.dto';
import type { FlowCreateData } from './flow.interface';

@Injectable()
export class FlowService extends CMSTabularService<FlowORM> {
  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(FlowORM)
    protected readonly orm: FlowORM,
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(EntitySerializer)
    protected readonly entitySerializer: EntitySerializer,
    @Inject(DiagramService)
    protected readonly diagram: DiagramService,
    @Inject(HashedIDService)
    private readonly hashedID: HashedIDService,
    @Inject(AssistantORM)
    protected readonly assistantORM: AssistantORM
  ) {
    super();
  }

  /* Find */

  async findManyWithSubResourcesByEnvironment(assistantID: string, environmentID: string) {
    const [flows] = await Promise.all([this.findManyByEnvironment(assistantID, environmentID)]);

    return {
      flows,
    };
  }

  async findManyWithSubResourcesJSONByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    const flows = await this.orm.findAllJSON({ assistant, environmentID });

    return {
      flows,
    };
  }

  /* Export */

  prepareExportData({ flows }: { flows: FlowEntity[] }, { backup }: { backup?: boolean } = {}): FlowExportImportDataDTO {
    if (backup) {
      return {
        flows: this.entitySerializer.iterable(flows),
      };
    }

    return {
      flows: this.entitySerializer.iterable(flows, { omit: ['assistantID', 'environmentID'] }),
    };
  }

  prepareExportJSONData({ flows }: { flows: ToJSONWithForeignKeys<FlowEntity>[] }): FlowExportImportDataDTO {
    return {
      flows: flows.map((item) => Utils.object.omit(item, ['assistantID', 'environmentID'])),
    };
  }

  /* Clone */

  async cloneManyWithSubResourcesForEnvironment(
    {
      sourceAssistantID,
      targetAssistantID,
      sourceEnvironmentID,
      targetEnvironmentID,
    }: {
      sourceAssistantID: string;
      targetAssistantID: string;
      sourceEnvironmentID: string;
      targetEnvironmentID: string;
    },
    { flush = true }: ORMMutateOptions = {}
  ) {
    const { flows: sourceFlows } = await this.findManyWithSubResourcesByEnvironment(sourceAssistantID, sourceEnvironmentID);

    const result = this.importManyWithSubResources(
      {
        flows: cloneManyEntities(sourceFlows, { assistantID: targetAssistantID, environmentID: targetEnvironmentID }),
      },
      { flush: false }
    );

    if (flush) {
      await this.orm.em.flush();
    }

    return result;
  }

  /* Import */

  prepareImportData(
    { flows }: FlowExportImportDataDTO,
    { userID, backup, assistantID, environmentID }: { userID: number; backup?: boolean; assistantID: string; environmentID: string }
  ): { flows: ToJSONWithForeignKeys<FlowEntity>[] } {
    const createdAt = new Date().toJSON();

    if (backup) {
      return {
        flows: flows.map((item) => ({
          ...item,
          assistantID,
          environmentID,
        })),
      };
    }

    return {
      flows: flows.map((item) => ({
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

  async importManyWithSubResources(
    data: {
      flows: ToJSONWithForeignKeys<FlowEntity>[];
    },
    { flush = true }: ORMMutateOptions = {}
  ) {
    const [flows] = await Promise.all([this.createMany(data.flows, { flush: false })]);

    if (flush) {
      await this.orm.em.flush();
    }

    return {
      flows,
    };
  }

  /* Create */

  async createManyAndSync(
    userID: number,
    data: FlowCreateData[],
    meta: { environmentID: string; assistantID: string; workspaceID: string; clientID: string; userID: number }
  ) {
    return this.postgresEM.transactional(async () => {
      const diagrams = await this.diagram.createManyComponents(data, meta);

      const flows = await this.createManyForUser(
        userID,
        data.map(({ flow }, index) => ({
          name: flow.name,
          folderID: flow.folderID,
          diagramID: diagrams[index].id,
          description: flow.description,
          assistantID: meta.assistantID,
          environmentID: meta.environmentID,
        }))
      );

      return {
        add: { flows, diagrams },
      };
    });
  }

  async broadcastAddMany(
    authMeta: AuthMetaPayload,
    { add }: { add: { flows: FlowEntity[]; diagrams: DiagramEntity[] } },
    meta: { environmentID: string; assistantID: string; workspaceID: string; clientID: string; userID: number }
  ) {
    await Promise.all([
      ...groupByAssistant(add.flows).map((flows) =>
        this.logux.processAs(
          Actions.Flow.AddMany({
            data: this.entitySerializer.iterable(flows),
            context: assistantBroadcastContext(flows[0]),
          }),
          authMeta
        )
      ),
      this.diagram.broadcastAddMany(authMeta, add.diagrams, meta),
    ]);
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: FlowCreateData[], meta: { environmentID: string; assistantID: string }) {
    const assistant = await this.assistantORM.findOneOrFail(meta.assistantID);
    const completeMeta = {
      ...authMeta,
      ...meta,
      workspaceID: this.hashedID.encodeWorkspaceID(assistant.workspace.id),
    };
    const result = await this.createManyAndSync(authMeta.userID, data, completeMeta);

    await this.broadcastAddMany(authMeta, result, completeMeta);

    return result.add.flows;
  }

  /* Delete */

  async deleteManyAndSync(ids: Primary<FlowEntity>[], keepDiagram?: boolean) {
    return this.postgresEM.transactional(async () => {
      const flows = await this.findMany(ids);

      await this.deleteMany(flows, { flush: false });

      if (!keepDiagram) {
        const diagrams = await this.diagram.findMany(flows.map((flow) => ({ diagramID: flow.diagramID, versionID: flow.environmentID })));
        await this.diagram.deleteMany(diagrams);
      }

      await this.orm.em.flush();

      return {
        delete: { flows },
      };
    });
  }

  async broadcastDeleteMany(
    authMeta: AuthMetaPayload,
    {
      delete: del,
    }: {
      delete: {
        flows: FlowEntity[];
      };
    }
  ) {
    await Promise.all([
      ...groupByAssistant(del.flows).map((flows) =>
        this.logux.processAs(
          Actions.Flow.DeleteMany({
            ids: toEntityIDs(flows),
            context: assistantBroadcastContext(flows[0]),
          }),
          authMeta
        )
      ),
    ]);
  }

  async deleteManyAndBroadcast(authMeta: AuthMetaPayload, ids: Primary<FlowEntity>[]): Promise<void> {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(authMeta, result);
  }

  /* Upsert */

  async upsertManyWithSubResources(data: { flows: Flow[] }, meta: { userID: number; assistantID: string; environmentID: string }) {
    const { flows } = this.prepareImportData(data, meta);

    await this.upsertMany(flows);
  }

  /* Duplicate */

  async copyPasteManyAndBroadcast(
    authMeta: AuthMetaPayload,
    data: Actions.Flow.CopyPasteMany.Request['data'],
    meta: { environmentID: string; assistantID: string }
  ) {
    const flows: FlowEntity[] = [];
    const diagrams: DiagramEntity[] = [];
    const flowsByID = await this.orm.findManyBydiagramIDs(data.sourceDiagramIDs);
    const assistant = await this.assistantORM.findOneOrFail(meta.assistantID);
    const completeMeta = {
      userID: authMeta.userID,
      clientID: authMeta.clientID,
      assistantID: meta.assistantID,
      environmentID: meta.environmentID,
      workspaceID: this.hashedID.encodeWorkspaceID(assistant.workspace.id),
    };

    for (const flow of flowsByID) {
      const { diagramID, folder, description, name } = flow;
      const diagram = await this.diagram.findOneOrFail({ diagramID, versionID: data.sourceEnvironmentID });

      const [createdDiagram] = await this.diagram.createManyComponents(
        [
          {
            flow: this.entitySerializer.nullable(flow),
            diagram: {
              type: diagram.type,
              zoom: diagram.zoom,
              name: diagram.name,
              nodes: diagram.nodes,
              offsetX: diagram.offsetX,
              offsetY: diagram.offsetY,
              modified: diagram.modified,
              variables: diagram.variables,
              menuItems: diagram.menuItems,
            },
          },
        ],
        completeMeta
      );

      const createdFlow = await this.createOneForUser(
        authMeta.userID,
        {
          name,
          description,
          diagramID: createdDiagram.id,
          folderID: folder?.id ?? null,
          assistantID: meta.assistantID,
          environmentID: meta.environmentID,
        },
        { flush: false }
      );

      flows.push(createdFlow);
      diagrams.push(createdDiagram);
    }

    await this.orm.em.flush();

    await this.broadcastAddMany(
      authMeta,
      {
        add: {
          flows,
          diagrams,
        },
      },
      completeMeta
    );

    return flows;
  }

  async duplicateOneAndBroadcast(authMeta: AuthMetaPayload, data: { flowID: string }, meta: { environmentID: string; assistantID: string }) {
    const assistant = await this.assistantORM.findOneOrFail(meta.assistantID);
    const duplicateFlowResource = await this.findOneOrFail({ id: data.flowID, environmentID: meta.environmentID });
    const diagram = await this.diagram.findOneOrFail({ diagramID: duplicateFlowResource.diagramID, versionID: meta.environmentID });
    const completeMeta = {
      userID: authMeta.userID,
      assistantID: meta.assistantID,
      environmentID: meta.environmentID,
      clientID: authMeta.clientID,
      workspaceID: this.hashedID.encodeWorkspaceID(assistant.workspace.id),
    };
    const [createdDiagram] = await this.diagram.createManyComponents(
      [
        {
          flow: this.entitySerializer.nullable(duplicateFlowResource),
          diagram: {
            type: diagram.type,
            zoom: diagram.zoom,
            name: diagram.name,
            nodes: diagram.nodes,
            offsetX: diagram.offsetX,
            offsetY: diagram.offsetY,
            modified: diagram.modified,
            variables: diagram.variables,
            menuItems: diagram.menuItems,
          },
        },
      ],
      completeMeta
    );

    const flow = await this.createOneForUser(authMeta.userID, {
      folderID: duplicateFlowResource.folder?.id ?? null,
      environmentID: duplicateFlowResource.environmentID,
      description: duplicateFlowResource.description,
      name: `${duplicateFlowResource.name} (copy)`,
      assistantID: meta.assistantID,
      diagramID: createdDiagram.id,
    });

    await this.broadcastAddMany(
      authMeta,
      {
        add: {
          flows: [flow],
          diagrams: [createdDiagram],
        },
      },
      completeMeta
    );

    return flow;
  }
}

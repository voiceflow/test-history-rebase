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
    const flows = await this.findManyByEnvironment(assistantID, environmentID);

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
    const flows = await this.createMany(data.flows, { flush: false });

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

  async collectRelationsToDelete(flows: FlowEntity[]) {
    const diagrams = await this.diagram.findMany(flows.map((flow) => ({ diagramID: flow.diagramID, versionID: flow.environmentID })));

    return {
      diagrams,
    };
  }

  async deleteManyAndSync(ids: Primary<FlowEntity>[], { keepDiagram }: { keepDiagram?: boolean } = {}) {
    return this.postgresEM.transactional(async () => {
      const flows = await this.findMany(ids);
      let diagrams: DiagramEntity[] = [];

      if (!keepDiagram) {
        diagrams = await this.diagram.findMany(flows.map((flow) => ({ diagramID: flow.diagramID, versionID: flow.environmentID })));
        await this.diagram.deleteMany(diagrams);
      }
      await this.deleteMany(flows);
      return {
        delete: { flows, diagrams },
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
        diagrams: DiagramEntity[];
      };
    },
    { environmentID, assistantID }: { environmentID: string; assistantID: string }
  ) {
    const assistant = await this.assistantORM.findOneOrFail(assistantID);

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
      this.diagram.broadcastDeleteMany(authMeta, del.diagrams, {
        workspaceID: this.hashedID.encodeWorkspaceID(assistant.workspace.id),
        environmentID,
        assistantID,
      }),
    ]);
  }

  async deleteManyAndBroadcast(
    authMeta: AuthMetaPayload,
    ids: Primary<FlowEntity>[],
    context: { environmentID: string; assistantID: string }
  ): Promise<void> {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(authMeta, result, context);
  }

  /* Upsert */

  async upsertManyWithSubResources(data: { flows: Flow[] }, meta: { userID: number; assistantID: string; environmentID: string }) {
    const { flows } = this.prepareImportData(data, meta);

    await this.upsertMany(flows);
  }

  /* Duplicate */

  async duplicateMany(
    authMeta: AuthMetaPayload,
    flows: FlowEntity[],
    meta: {
      userID: number;
      clientID: string;
      workspaceID: string;
      assistantID: string;
      environmentID: string;
      sourceEnvironmentID?: string;
    }
  ) {
    const duplicatedFlows: FlowEntity[] = [];
    const duplicatedDiagrams: DiagramEntity[] = [];

    for (const flow of flows) {
      const { diagramID, folder, description, name } = flow;
      const diagram = await this.diagram.findOneOrFail({ diagramID, versionID: meta.sourceEnvironmentID || meta.environmentID });
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
        meta
      );

      const createdFlow = await this.createOneForUser(authMeta.userID, {
        name: meta.sourceEnvironmentID ? name : `${name} (Copy)`,
        description,
        diagramID: createdDiagram.id,
        folderID: folder?.id ?? null,
        assistantID: meta.assistantID,
        environmentID: meta.environmentID,
      });

      duplicatedFlows.push(createdFlow);
      duplicatedDiagrams.push(createdDiagram);
    }

    return {
      flows: duplicatedFlows,
      diagrams: duplicatedDiagrams,
    };
  }

  async copyPasteManyAndBroadcast(
    authMeta: AuthMetaPayload,
    data: Actions.Flow.CopyPasteMany.Request['data'],
    meta: { environmentID: string; assistantID: string }
  ) {
    const assistant = await this.assistantORM.findOneOrFail(meta.assistantID);
    const flowsByID = await this.orm.findManyByDiagramIDs(data.sourceEnvironmentID, data.sourceDiagramIDs);

    const completeMeta = {
      userID: authMeta.userID,
      clientID: authMeta.clientID,
      assistantID: meta.assistantID,
      environmentID: meta.environmentID,
      workspaceID: this.hashedID.encodeWorkspaceID(assistant.workspace.id),
      sourceEnvironmentID: data.sourceEnvironmentID,
    };

    const { flows, diagrams } = await this.duplicateMany(authMeta, flowsByID, completeMeta);

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
    const flow = await this.findOneOrFail({ id: data.flowID, environmentID: meta.environmentID });
    const completeMeta = {
      userID: authMeta.userID,
      assistantID: meta.assistantID,
      environmentID: meta.environmentID,
      clientID: authMeta.clientID,
      workspaceID: this.hashedID.encodeWorkspaceID(assistant.workspace.id),
    };

    const { flows, diagrams } = await this.duplicateMany(authMeta, [flow], completeMeta);

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

    return flow;
  }
}

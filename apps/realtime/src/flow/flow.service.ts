import type { EntityManager } from '@mikro-orm/core';
import { Primary } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { Flow } from '@voiceflow/dtos';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type { AssistantEntity, FlowEntity, ORMMutateOptions, ToJSONWithForeignKeys } from '@voiceflow/orm-designer';
import { DatabaseTarget, FlowORM, PKOrEntity } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSTabularService, EntitySerializer } from '@/common';
import { assistantBroadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';
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
    protected readonly entitySerializer: EntitySerializer
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

  async createManyAndSync(userID: number, data: FlowCreateData[]) {
    return this.postgresEM.transactional(async () => {
      const flows = await this.createManyForUser(userID, data, { flush: false });

      await this.orm.em.flush();

      return {
        add: { flows },
      };
    });
  }

  async broadcastAddMany(authMeta: AuthMetaPayload, { add }: { add: { flows: FlowEntity[] } }) {
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
    ]);
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: FlowCreateData[]) {
    const result = await this.createManyAndSync(authMeta.userID, data);

    await this.broadcastAddMany(authMeta, result);

    return result.add.flows;
  }

  /* Delete */

  async deleteManyAndSync(ids: Primary<FlowEntity>[]) {
    return this.postgresEM.transactional(async () => {
      const flows = await this.findMany(ids);

      await this.deleteMany(flows, { flush: false });

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

  async duplicateOneAndBroadcast(
    authMeta: AuthMetaPayload,
    { flowID, assistantID }: { flowID: Primary<FlowEntity>; assistantID: string; userID: number }
  ) {
    const duplicateFlowResource = await this.findOneOrFail(flowID);

    const flow = await this.createOneForUser(authMeta.userID, {
      assistantID,
      environmentID: duplicateFlowResource.environmentID,
      name: `${duplicateFlowResource.name} (copy)`,
      description: duplicateFlowResource.description,
      diagramID: duplicateFlowResource.diagramID ?? null,
      folderID: duplicateFlowResource.folder?.id ?? null,
    });

    await this.broadcastAddMany(authMeta, {
      add: {
        flows: [flow],
      },
    });

    return flow;
  }
}

import type { EntityManager } from '@mikro-orm/core';
import { Primary } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { Variable } from '@voiceflow/dtos';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type { AssistantEntity, ORMMutateOptions, PKOrEntity, ToJSONWithForeignKeys, VariableEntity } from '@voiceflow/orm-designer';
import { DatabaseTarget, VariableORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSTabularService, EntitySerializer } from '@/common';
import { assistantBroadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';
import { cloneManyEntities } from '@/utils/entity.util';

import type { VariableExportImportDataDTO } from './dtos/variable-export-import-data.dto';
import type { VariableCreateData } from './variable.interface';

@Injectable()
export class VariableService extends CMSTabularService<VariableORM> {
  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(VariableORM)
    protected readonly orm: VariableORM,
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(EntitySerializer)
    protected readonly entitySerializer: EntitySerializer
  ) {
    super();
  }

  /* Find */

  async findManyWithSubResourcesByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    const variables = await this.findManyByEnvironment(assistant, environmentID);

    return {
      variables,
    };
  }

  async findManyWithSubResourcesJSONByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    const variables = await this.orm.findAllJSON({ assistant, environmentID });

    return {
      variables,
    };
  }

  /* Export */

  prepareExportData({ variables }: { variables: VariableEntity[] }, { backup }: { backup?: boolean } = {}): VariableExportImportDataDTO {
    const json = {
      variables: this.entitySerializer.iterable(variables),
    };

    if (backup) {
      return json;
    }

    return this.prepareExportJSONData(json);
  }

  prepareExportJSONData({ variables }: { variables: ToJSONWithForeignKeys<VariableEntity>[] }): VariableExportImportDataDTO {
    return {
      variables: variables.map((item) => Utils.object.omit(item, ['assistantID', 'environmentID'])),
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
    const { variables: sourceVariables } = await this.findManyWithSubResourcesByEnvironment(sourceAssistantID, sourceEnvironmentID);

    const result = this.importManyWithSubResources(
      {
        variables: cloneManyEntities(sourceVariables, { assistantID: targetAssistantID, environmentID: targetEnvironmentID }),
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
    { variables }: VariableExportImportDataDTO,
    { userID, backup, assistantID, environmentID }: { userID: number; backup?: boolean; assistantID: string; environmentID: string }
  ): { variables: ToJSONWithForeignKeys<VariableEntity>[] } {
    const createdAt = new Date().toJSON();

    if (backup) {
      return {
        variables: variables.map((item) => ({
          ...item,
          assistantID,
          environmentID,
        })),
      };
    }

    return {
      variables: variables.map((item) => ({
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
      variables: ToJSONWithForeignKeys<VariableEntity>[];
    },
    { flush = true }: ORMMutateOptions = {}
  ) {
    const [variables] = await Promise.all([this.createMany(data.variables, { flush: false })]);

    if (flush) {
      await this.orm.em.flush();
    }

    return {
      variables,
    };
  }

  /* Create */

  async createManyAndSync(userID: number, data: VariableCreateData[]) {
    return this.postgresEM.transactional(async () => {
      const variables = await this.createManyForUser(userID, data, { flush: false });

      await this.orm.em.flush();

      return {
        add: { variables },
      };
    });
  }

  async broadcastAddMany(authMeta: AuthMetaPayload, { add }: { add: { variables: VariableEntity[] } }) {
    await Promise.all([
      ...groupByAssistant(add.variables).map((variables) =>
        this.logux.processAs(
          Actions.Variable.AddMany({
            data: this.entitySerializer.iterable(variables),
            context: assistantBroadcastContext(variables[0]),
          }),
          authMeta
        )
      ),
    ]);
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: VariableCreateData[]) {
    const result = await this.createManyAndSync(authMeta.userID, data);

    await this.broadcastAddMany(authMeta, result);

    return result.add.variables;
  }

  /* Delete */

  async deleteManyAndSync(ids: Primary<VariableEntity>[]) {
    return this.postgresEM.transactional(async () => {
      const variables = await this.orm.findMany(ids);

      const variablesWithoutSystem = variables.filter((variable) => !variable.isSystem);

      await this.deleteMany(variablesWithoutSystem, { flush: false });

      await this.orm.em.flush();

      return {
        delete: { variables: variablesWithoutSystem },
      };
    });
  }

  async broadcastDeleteMany(
    authMeta: AuthMetaPayload,
    {
      delete: del,
    }: {
      delete: {
        variables: VariableEntity[];
      };
    }
  ) {
    await Promise.all([
      ...groupByAssistant(del.variables).map((variables) =>
        this.logux.processAs(
          Actions.Variable.DeleteMany({
            ids: toEntityIDs(variables),
            context: assistantBroadcastContext(variables[0]),
          }),
          authMeta
        )
      ),
    ]);
  }

  async deleteManyAndBroadcast(authMeta: AuthMetaPayload, ids: Primary<VariableEntity>[]): Promise<void> {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(authMeta, result);
  }

  /* Upsert */

  async upsertManyWithSubResources(data: { variables: Variable[] }, meta: { userID: number; assistantID: string; environmentID: string }) {
    const { variables } = this.prepareImportData(data, meta);

    await this.upsertMany(variables);
  }
}

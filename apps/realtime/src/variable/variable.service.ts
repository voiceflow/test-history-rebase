import type { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { Variable } from '@voiceflow/dtos';
import { LoguxService } from '@voiceflow/nestjs-logux';
import type { VariableJSON, VariableObject } from '@voiceflow/orm-designer';
import { DatabaseTarget, VariableORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSTabularService } from '@/common';
import { cmsBroadcastContext, injectAssistantAndEnvironmentIDs, toPostgresEntityIDs } from '@/common/utils';
import { CMSBroadcastMeta, CMSContext } from '@/types';

import type { VariableExportImportDataDTO } from './dtos/variable-export-import-data.dto';
import type { VariableCreateData } from './variable.interface';

@Injectable()
export class VariableService extends CMSTabularService<VariableORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(VariableORM)
    protected readonly orm: VariableORM,
    @Inject(LoguxService)
    private readonly logux: LoguxService
  ) {
    super();
  }

  /* Find */

  async findManyWithSubResourcesByEnvironment(environmentID: string) {
    const variables = await this.findManyByEnvironment(environmentID);

    return {
      variables,
    };
  }

  /* Export */

  toJSONWithSubResources({ variables }: { variables: VariableObject[] }) {
    return {
      variables: this.mapToJSON(variables),
    };
  }

  fromJSONWithSubResources({ variables }: VariableExportImportDataDTO) {
    return {
      variables: this.mapFromJSON(variables),
    };
  }

  prepareExportData(data: { variables: VariableObject[] }, { backup }: { backup?: boolean } = {}) {
    const json = this.toJSONWithSubResources(data);

    if (backup) {
      return json;
    }

    return {
      variables: json.variables.map((item) => Utils.object.omit(item, ['assistantID', 'environmentID'])),
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
    const { variables: sourceVariables } = await this.findManyWithSubResourcesByEnvironment(sourceEnvironmentID);

    return this.importManyWithSubResources({
      variables: sourceVariables.map((item) => ({
        ...item,
        assistantID: targetAssistantID,
        environmentID: targetEnvironmentID,
      })),
    });
  }

  /* Import */

  prepareImportData(
    { variables }: VariableExportImportDataDTO,
    {
      userID,
      backup,
      assistantID,
      environmentID,
    }: { userID: number; backup?: boolean; assistantID: string; environmentID: string }
  ): { variables: VariableJSON[] } {
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

  async importManyWithSubResources(data: { variables: VariableObject[] }) {
    const variables = await this.createMany(data.variables);

    return {
      variables,
    };
  }

  /* Create */

  async createManyAndSync(data: VariableCreateData[], { userID, context }: { userID: number; context: CMSContext }) {
    return this.postgresEM.transactional(async () => {
      const variables = await this.createManyForUser(userID, data.map(injectAssistantAndEnvironmentIDs(context)));

      return {
        add: { variables },
      };
    });
  }

  async broadcastAddMany({ add }: { add: { variables: VariableObject[] } }, meta: CMSBroadcastMeta) {
    await this.logux.processAs(
      Actions.Variable.AddMany({
        data: this.mapToJSON(add.variables),
        context: cmsBroadcastContext(meta.context),
      }),
      meta.auth
    );
  }

  async createManyAndBroadcast(data: VariableCreateData[], meta: CMSBroadcastMeta) {
    const result = await this.createManyAndSync(data, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastAddMany(result, meta);

    return result.add.variables;
  }

  /* Delete */

  async deleteManyAndSync(ids: string[], { context }: { context: CMSContext }) {
    return this.postgresEM.transactional(async () => {
      const variables = await this.findManyByEnvironmentAndIDs(context.environmentID, ids);

      const variablesWithoutSystem = variables.filter((variable) => !variable.isSystem);

      await this.deleteManyByEnvironmentAndIDs(context.environmentID, toPostgresEntityIDs(variablesWithoutSystem));

      return {
        delete: { variables: variablesWithoutSystem },
      };
    });
  }

  async broadcastDeleteMany(
    {
      delete: del,
    }: {
      delete: {
        variables: VariableObject[];
      };
    },
    meta: CMSBroadcastMeta
  ) {
    await this.logux.processAs(
      Actions.Variable.DeleteMany({
        ids: toPostgresEntityIDs(del.variables),
        context: cmsBroadcastContext(meta.context),
      }),
      meta.auth
    );
  }

  async deleteManyAndBroadcast(ids: string[], meta: CMSBroadcastMeta) {
    const result = await this.deleteManyAndSync(ids, { context: meta.context });

    await this.broadcastDeleteMany(result, meta);
  }

  /* Upsert */

  async upsertManyWithSubResources(
    data: { variables: Variable[] },
    meta: { userID: number; assistantID: string; environmentID: string }
  ) {
    const { variables } = this.prepareImportData(data, meta);

    await this.upsertMany(this.mapFromJSON(variables));
  }
}

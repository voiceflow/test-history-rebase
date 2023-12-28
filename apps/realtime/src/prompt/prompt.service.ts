import { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { Prompt } from '@voiceflow/dtos';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type { ORMMutateOptions, PromptEntity, PromptResponseVariantEntity, ToJSONWithForeignKeys } from '@voiceflow/orm-designer';
import { PromptORM, ResponsePromptVariantORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSTabularService, EntitySerializer } from '@/common';
import type { CreateManyForUserData } from '@/common/types';
import { assistantBroadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';
import { cloneManyEntities } from '@/utils/entity.util';

@Injectable()
export class PromptService extends CMSTabularService<PromptORM> {
  constructor(
    @Inject(PromptORM)
    protected readonly orm: PromptORM,
    @Inject(ResponsePromptVariantORM)
    protected readonly responsePromptVariantORM: ResponsePromptVariantORM,
    @Inject(LoguxService)
    protected readonly logux: LoguxService,
    @Inject(EntitySerializer)
    protected readonly entitySerializer: EntitySerializer
  ) {
    super();
  }

  async findManyWithSubResourcesByEnvironment(assistantID: string, environmentID: string) {
    const [prompts] = await Promise.all([this.findManyByEnvironment(assistantID, environmentID)]);

    return {
      prompts,
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
    const { prompts: sourcePrompts } = await this.findManyWithSubResourcesByEnvironment(sourceAssistantID, sourceEnvironmentID);

    const result = this.importManyWithSubResources(
      { prompts: cloneManyEntities(sourcePrompts, { assistantID: targetAssistantID, environmentID: targetEnvironmentID }) },
      { flush: false }
    );

    if (flush) {
      await this.orm.em.flush();
    }

    return result;
  }

  /* Import */

  async importManyWithSubResources(
    data: {
      prompts: ToJSONWithForeignKeys<PromptEntity>[];
    },
    { flush = true }: ORMMutateOptions = {}
  ) {
    const [prompts] = await Promise.all([this.createMany(data.prompts, { flush: false })]);

    if (flush) {
      await this.orm.em.flush();
    }

    return {
      prompts,
    };
  }

  /* Create */

  async createManyAndSync(userID: number, data: CreateManyForUserData<PromptORM>) {
    const prompts = await this.createManyForUser(userID, data);

    return {
      add: { prompts },
    };
  }

  async broadcastAddMany(authMeta: AuthMetaPayload, { add }: { add: { prompts: PromptEntity[] } }) {
    await Promise.all(
      groupByAssistant(add.prompts).map((prompts) =>
        this.logux.processAs(
          Actions.Prompt.AddMany({
            data: this.entitySerializer.iterable(prompts),
            context: assistantBroadcastContext(prompts[0]),
          }),
          authMeta
        )
      )
    );
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: CreateManyForUserData<PromptORM>) {
    const result = await this.createManyAndSync(authMeta.userID, data);

    await this.broadcastAddMany(authMeta, result);

    return result.add.prompts;
  }

  /* Delete */

  async broadcastDeleteMany(
    authMeta: AuthMetaPayload,
    {
      sync,
      delete: del,
    }: {
      sync: { responseVariants: PromptResponseVariantEntity[] };
      delete: { prompts: PromptEntity[] };
    }
  ) {
    await Promise.all([
      ...groupByAssistant(sync.responseVariants).map((responseVariants) =>
        this.logux.processAs(
          Actions.ResponseVariant.PatchMany({
            ids: toEntityIDs(responseVariants),
            patch: { promptID: null },
            context: assistantBroadcastContext(responseVariants[0]),
          }),
          authMeta
        )
      ),
      ...groupByAssistant(del.prompts).map((prompts) =>
        this.logux.processAs(
          Actions.Prompt.DeleteMany({
            ids: toEntityIDs(prompts),
            context: assistantBroadcastContext(prompts[0]),
          }),
          authMeta
        )
      ),
    ]);
  }

  async deleteManyAndSync(ids: Primary<PromptEntity>[]) {
    const prompts = await this.findMany(ids);
    const responseVariants = await this.responsePromptVariantORM.findManyByPrompts(prompts);

    await Promise.all([
      this.deleteMany(prompts, { flush: false }),
      this.responsePromptVariantORM.patchMany(responseVariants, { promptID: null }, { flush: false }),
    ]);

    await this.orm.em.flush();

    return {
      sync: { responseVariants },
      delete: { prompts },
    };
  }

  async deleteManyAndBroadcast(authMeta: AuthMetaPayload, ids: Primary<PromptEntity>[]) {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(authMeta, result);
  }

  /* Upsert */
  async upsertManyWithSubResources({ prompts }: { prompts: Prompt[] }) {
    await this.upsertMany(prompts);
  }
}

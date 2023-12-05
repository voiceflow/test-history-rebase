import { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type {
  AssistantEntity,
  ORMMutateOptions,
  PKOrEntity,
  PromptEntity,
  PromptResponseVariantEntity,
  ToJSONWithForeignKeys,
} from '@voiceflow/orm-designer';
import { PromptORM, ResponsePromptVariantORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { EntitySerializer, MutableService } from '@/common';
import type { CreateManyData } from '@/common/types';
import { assistantBroadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';
import { cloneManyEntities } from '@/utils/entity.util';

@Injectable()
export class PromptService extends MutableService<PromptORM> {
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

  /* Find */

  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.orm.findManyByAssistant(assistant, environmentID);
  }

  async findManyWithSubResourcesByAssistant(assistantID: string, environmentID: string) {
    const [prompts] = await Promise.all([this.findManyByAssistant(assistantID, environmentID)]);

    return {
      prompts,
    };
  }

  /* Clone */

  async cloneManyWithSubResourcesForEnvironment(
    {
      assistantID,
      sourceEnvironmentID,
      targetEnvironmentID,
    }: {
      assistantID: string;
      sourceEnvironmentID: string;
      targetEnvironmentID: string;
    },
    { flush = true }: ORMMutateOptions = {}
  ) {
    const [{ prompts: sourcePrompts }, targetPrompts] = await Promise.all([
      this.findManyWithSubResourcesByAssistant(assistantID, sourceEnvironmentID),
      this.findManyByAssistant(assistantID, targetEnvironmentID),
    ]);

    await this.deleteMany(targetPrompts, { flush: false });

    const result = this.importManyWithSubResources(
      { prompts: cloneManyEntities(sourcePrompts, { environmentID: targetEnvironmentID }) },
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

  async createManyAndSync(data: CreateManyData<PromptORM>) {
    const prompts = await this.createMany(data);

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

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: CreateManyData<PromptORM>) {
    const result = await this.createManyAndSync(data);

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
}

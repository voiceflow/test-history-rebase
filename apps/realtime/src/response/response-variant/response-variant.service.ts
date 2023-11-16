/* eslint-disable no-await-in-loop, max-params, no-restricted-syntax */
import { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { NotFoundException } from '@voiceflow/exception';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type {
  AnyResponseAttachmentEntity,
  AnyResponseVariantEntity,
  AssistantEntity,
  ORMMutateOptions,
  PKOrEntity,
  PromptEntity,
  ResponseDiscriminatorEntity,
} from '@voiceflow/orm-designer';
import { PromptORM, ResponseDiscriminatorORM, ResponseVariantORM, ResponseVariantType } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { match } from 'ts-pattern';

import { EntitySerializer } from '@/common';
import { assistantBroadcastContext, groupByAssistant, toEntityID, toEntityIDs } from '@/common/utils';

import { PromptService } from '../../prompt/prompt.service';
import { ResponseAttachmentService } from '../response-attachment/response-attachment.service';
import { ResponseJSONVariantService } from './response-json-variant.service';
import { ResponsePromptVariantService } from './response-prompt-variant.service';
import { ResponseTextVariantService } from './response-text-variant.service';
import type { ResponseAnyVariantCreateData, ResponseAnyVariantCreateRefData, ResponseAnyVariantPatchData } from './response-variant.interface';
import { emptyResponseVariantFactory } from './response-variant.util';

@Injectable()
export class ResponseVariantService {
  constructor(
    @Inject(ResponseVariantORM)
    protected readonly orm: ResponseVariantORM,
    @Inject(PromptORM)
    protected readonly promptORM: PromptORM,
    @Inject(ResponseDiscriminatorORM)
    protected readonly responseDiscriminatorORM: ResponseDiscriminatorORM,
    @Inject(LoguxService)
    protected readonly logux: LoguxService,
    @Inject(PromptService)
    protected readonly prompt: PromptService,
    @Inject(ResponseAttachmentService)
    protected readonly responseAttachment: ResponseAttachmentService,
    @Inject(ResponseJSONVariantService)
    protected readonly responseJSONVariant: ResponseJSONVariantService,
    @Inject(ResponseTextVariantService)
    protected readonly responseTextVariant: ResponseTextVariantService,
    @Inject(ResponsePromptVariantService)
    protected readonly responsePromptVariant: ResponsePromptVariantService,
    @Inject(EntitySerializer)
    protected readonly entitySerializer: EntitySerializer
  ) {}

  /* Helpers */

  protected async syncDiscriminators(
    variants: AnyResponseVariantEntity[],
    { flush = true, action }: { flush?: boolean; action: 'create' | 'delete' }
  ) {
    const responseDiscriminatorIDs = Utils.array.unique(
      variants.map(({ discriminator }) => ({ id: discriminator.id, environmentID: discriminator.environmentID }))
    );

    const responseDiscriminators = await this.responseDiscriminatorORM.findMany(responseDiscriminatorIDs);

    if (responseDiscriminatorIDs.length !== responseDiscriminators.length) {
      throw new NotFoundException("couldn't find response discriminator to sync");
    }

    const responseVariantsByResponseDiscriminatorIDMap = variants.reduce<Record<string, typeof variants>>((acc, variant) => {
      acc[variant.discriminator.id] ??= [];
      acc[variant.discriminator.id].push(variant);

      return acc;
    }, {});

    responseDiscriminators.forEach((discriminator) => {
      const variantIDs = responseVariantsByResponseDiscriminatorIDMap[discriminator.id]?.map(toEntityID);

      if (!variantIDs?.length) {
        throw new NotFoundException("couldn't find variants for discriminator to sync");
      }

      let variantOrder: string[];

      if (action === 'create') {
        if (discriminator.variantOrder.length) {
          variantOrder = [discriminator.variantOrder[0], ...variantIDs, ...discriminator.variantOrder.slice(1)];
        } else {
          variantOrder = variantIDs;
        }
      } else {
        variantOrder = discriminator.variantOrder.filter((id) => !variantIDs.includes(id));
      }

      // eslint-disable-next-line no-param-reassign
      discriminator.variantOrder = variantOrder;
    });

    if (flush) {
      await this.orm.em.flush();
    }

    return responseDiscriminators;
  }

  async broadcastSync(authMeta: AuthMetaPayload, { sync }: { sync: { responseDiscriminators: ResponseDiscriminatorEntity[] } }) {
    await Promise.all(
      groupByAssistant(sync.responseDiscriminators).flatMap((discriminators) =>
        discriminators.map((discriminator) =>
          this.logux.processAs(
            Actions.ResponseDiscriminator.PatchOne({
              id: discriminator.id,
              patch: { variantOrder: discriminator.variantOrder },
              context: assistantBroadcastContext(discriminator),
            }),
            authMeta
          )
        )
      )
    );
  }

  /* Find */

  findMany(ids: Primary<AnyResponseAttachmentEntity>[]): Promise<AnyResponseVariantEntity[]> {
    return this.orm.findMany(ids);
  }

  findOneOrFail(id: Primary<AnyResponseAttachmentEntity> & { type?: ResponseVariantType }): Promise<AnyResponseVariantEntity> {
    return this.orm.findOneOrFail(id);
  }

  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string): Promise<AnyResponseVariantEntity[]> {
    return this.orm.findManyByAssistant(assistant, environmentID);
  }

  findManyByDiscriminators(discriminators: PKOrEntity<ResponseDiscriminatorEntity>[]): Promise<AnyResponseVariantEntity[]> {
    return this.orm.findManyByDiscriminators(discriminators);
  }

  /* Create */

  createOne(data: ResponseAnyVariantCreateData, options?: ORMMutateOptions) {
    return match(data)
      .with({ type: ResponseVariantType.JSON }, (data) => this.responseJSONVariant.createOne(data, options))
      .with({ type: ResponseVariantType.TEXT }, (data) => this.responseTextVariant.createOne(data, options))
      .with({ type: ResponseVariantType.PROMPT }, (data) => this.responsePromptVariant.createOne(data, options))
      .exhaustive();
  }

  async createMany(data: ResponseAnyVariantCreateData[], { flush = true }: ORMMutateOptions = {}) {
    const result = await Promise.all(data.map((item) => this.createOne(item, { flush: false })));

    if (flush) {
      await this.orm.em.flush();
    }

    return result;
  }

  async createManyWithRefs(userID: number, data: ResponseAnyVariantCreateRefData[], { flush = true }: ORMMutateOptions = {}) {
    const prompts: PromptEntity[] = [];
    const responseVariants: AnyResponseVariantEntity[] = [];
    const responseAttachments: AnyResponseAttachmentEntity[] = [];

    // TODO: add condition
    for (const { attachments, ...variantData } of data) {
      let variantPayload: ResponseAnyVariantCreateData;

      if (variantData.type === ResponseVariantType.PROMPT && 'prompt' in variantData) {
        const prompt = await this.promptORM.createOne(
          {
            ...variantData.prompt,
            name: variantData.prompt.name ?? 'Prompt for response',
            folderID: null,
            updatedByID: userID,
            createdByID: userID,
            assistantID: variantData.assistantID,
            environmentID: variantData.environmentID,
          },
          { flush: false }
        );

        variantPayload = {
          ...Utils.object.omit(variantData, ['prompt']),
          promptID: prompt.id,
          conditionID: null,
          attachmentOrder: [],
        };

        prompts.push(prompt);
      } else {
        variantPayload = { ...variantData, conditionID: null, attachmentOrder: [] };
      }

      const responseVariant = await this.createOne(variantPayload, { flush: false });
      const responseVariantAttachments = await this.responseAttachment.createMany(
        attachments.map((attachment) => ({
          ...attachment,
          variantID: responseVariant.id,
          assistantID: responseVariant.assistant.id,
          environmentID: responseVariant.environmentID,
        })),
        { flush: false }
      );

      responseVariant.attachmentOrder = responseVariantAttachments.map((attachment) => attachment.id);

      responseVariants.push(responseVariant);
      responseAttachments.push(...responseVariantAttachments);
    }

    if (flush) {
      await this.orm.em.flush();
    }

    return {
      prompts,
      responseVariants,
      responseAttachments,
    };
  }

  async createManyAndSync(userID: number, data: ResponseAnyVariantCreateRefData[]) {
    const { prompts, responseVariants, responseAttachments } = await this.createManyWithRefs(userID, data, { flush: false });

    const responseDiscriminators = await this.syncDiscriminators(responseVariants, { flush: false, action: 'create' });

    await this.orm.em.flush();

    return {
      add: { prompts, responseVariants, responseAttachments },
      sync: { responseDiscriminators },
    };
  }

  async broadcastAddMany(
    authMeta: AuthMetaPayload,
    {
      add,
      sync,
    }: {
      add: { prompts: PromptEntity[]; responseVariants: AnyResponseVariantEntity[]; responseAttachments: AnyResponseAttachmentEntity[] };
      sync: { responseDiscriminators: ResponseDiscriminatorEntity[] };
    }
  ) {
    await Promise.all([
      this.prompt.broadcastAddMany(authMeta, {
        add: Utils.object.pick(add, ['prompts']),
      }),

      this.responseAttachment.broadcastAddMany(authMeta, {
        add: Utils.object.pick(add, ['responseAttachments']),
        // no need to sync attachments, should be synced on create
        sync: { responseVariants: [] },
      }),

      ...groupByAssistant(add.responseVariants).map((variants) =>
        this.logux.processAs(
          Actions.ResponseVariant.AddMany({
            data: this.entitySerializer.iterable(variants),
            context: assistantBroadcastContext(variants[0]),
          }),
          authMeta
        )
      ),

      this.broadcastSync(authMeta, { sync }),
    ]);
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: ResponseAnyVariantCreateRefData[]) {
    const result = await this.createManyAndSync(authMeta.userID, data);

    await this.broadcastAddMany(authMeta, result);

    return result.add.responseVariants;
  }

  /* Update */

  patchMany(ids: Primary<AnyResponseVariantEntity>[], patch: ResponseAnyVariantPatchData) {
    return match(patch)
      .with({ type: ResponseVariantType.JSON }, (data) => this.responseJSONVariant.patchMany(ids, data))
      .with({ type: ResponseVariantType.TEXT }, (data) => this.responseTextVariant.patchMany(ids, data))
      .with({ type: ResponseVariantType.PROMPT }, (data) => this.responsePromptVariant.patchMany(ids, data))
      .exhaustive();
  }

  async replaceWithTypeAndSync(
    id: Primary<AnyResponseVariantEntity>,
    type: ResponseVariantType
  ): Promise<{
    add: { responseVariants: AnyResponseVariantEntity[] };
    sync: { responseDiscriminators: ResponseDiscriminatorEntity[] };
    delete: { responseVariants: AnyResponseVariantEntity[]; responseAttachments: AnyResponseAttachmentEntity[] };
  }> {
    const responseVariant = await this.findOneOrFail(id);

    const [newResponseVariant, responseDiscriminator, relationsToDelete] = await Promise.all([
      this.createOne(
        emptyResponseVariantFactory({
          type,
          assistantID: responseVariant.assistant.id,
          environmentID: responseVariant.environmentID,
          discriminatorID: responseVariant.discriminator.id,
        }),
        { flush: false }
      ),
      this.responseDiscriminatorORM.findOneOrFail({ id: responseVariant.discriminator.id, environmentID: responseVariant.environmentID }),
      this.collectRelationsToDelete([responseVariant]),
    ]);

    await this.deleteMany([responseVariant], { flush: false });

    responseDiscriminator.variantOrder = responseDiscriminator.variantOrder.map((variantID) =>
      variantID === id.id ? newResponseVariant.id : variantID
    );

    await this.orm.em.flush();

    return {
      add: { responseVariants: [newResponseVariant] },
      sync: { responseDiscriminators: [responseDiscriminator] },
      delete: { ...relationsToDelete, responseVariants: [responseVariant] },
    };
  }

  async broadcastReplaceWithType(
    authMeta: AuthMetaPayload,
    {
      add,
      sync,
      delete: del,
    }: {
      add: { responseVariants: AnyResponseVariantEntity[] };
      sync: { responseDiscriminators: ResponseDiscriminatorEntity[] };
      delete: { responseVariants: AnyResponseVariantEntity[]; responseAttachments: AnyResponseAttachmentEntity[] };
    }
  ) {
    await Promise.all([
      // no need to sync discriminators on delete, should be synced on create
      this.broadcastDeleteMany(authMeta, { delete: del, sync: { responseDiscriminators: [] } }),
      this.broadcastAddMany(authMeta, { add: { ...add, prompts: [], responseAttachments: [] }, sync }),
    ]);
  }

  async replaceWithTypeAndBroadcast(authMeta: AuthMetaPayload, id: Primary<AnyResponseVariantEntity>, type: ResponseVariantType) {
    const result = await this.replaceWithTypeAndSync(id, type);

    await this.broadcastReplaceWithType(authMeta, result);
  }

  /* Delete */

  deleteMany(variants: PKOrEntity<AnyResponseVariantEntity>[], options?: ORMMutateOptions) {
    return this.orm.deleteMany(variants, options);
  }

  async collectRelationsToDelete(variants: PKOrEntity<AnyResponseVariantEntity>[]) {
    const responseAttachments = await this.responseAttachment.findManyByVariants(variants);

    return {
      responseAttachments,
    };
  }

  async syncOnDelete(variants: AnyResponseVariantEntity[], options?: ORMMutateOptions) {
    const responseDiscriminators = await this.syncDiscriminators(variants, { ...options, action: 'delete' });

    return { responseDiscriminators };
  }

  async deleteManyAndSync(ids: Primary<AnyResponseVariantEntity>[]): Promise<{
    sync: { responseDiscriminators: ResponseDiscriminatorEntity[] };
    delete: { responseVariants: AnyResponseVariantEntity[]; responseAttachments: AnyResponseAttachmentEntity[] };
  }> {
    const responseVariants = await this.findMany(ids);

    const [relations, sync] = await Promise.all([
      this.collectRelationsToDelete(responseVariants),
      this.syncOnDelete(responseVariants, { flush: false }),
    ]);

    await this.deleteMany(responseVariants, { flush: false });

    await this.orm.em.flush();

    return {
      sync,
      delete: { ...relations, responseVariants },
    };
  }

  async broadcastDeleteMany(
    authMeta: AuthMetaPayload,
    {
      sync,
      delete: del,
    }: {
      sync: { responseDiscriminators: ResponseDiscriminatorEntity[] };
      delete: { responseVariants: AnyResponseVariantEntity[]; responseAttachments: AnyResponseAttachmentEntity[] };
    }
  ) {
    await Promise.all([
      this.broadcastSync(authMeta, { sync }),

      ...groupByAssistant(del.responseVariants).map((variants) =>
        this.logux.processAs(
          Actions.ResponseVariant.DeleteMany({
            ids: toEntityIDs(variants),
            context: assistantBroadcastContext(variants[0]),
          }),
          authMeta
        )
      ),

      this.responseAttachment.broadcastDeleteMany(authMeta, {
        delete: Utils.object.pick(del, ['responseAttachments']),
        // no need to sync attachments, variants are removed
        sync: { responseVariants: [] },
      }),
    ]);
  }

  async deleteManyAndBroadcast(authMeta: AuthMetaPayload, ids: Primary<AnyResponseVariantEntity>[]) {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(authMeta, result);
  }
}

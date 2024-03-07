/* eslint-disable no-await-in-loop, max-params */
import type { EntityManager } from '@mikro-orm/core';
import { Primary, ref } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { ResponseVariantType } from '@voiceflow/dtos';
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
import { DatabaseTarget, PromptORM, ResponseDiscriminatorORM, ResponseVariantORM, UserStubEntity } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { match } from 'ts-pattern';

import { EntitySerializer, UpsertManyData } from '@/common';
import { assistantBroadcastContext, groupByAssistant, toEntityID, toEntityIDs } from '@/common/utils';
import { uniqCMSResourceIDs } from '@/utils/cms.util';

import { ResponseAttachmentService } from '../response-attachment/response-attachment.service';
import { ResponseJSONVariantService } from './response-json-variant.service';
import { ResponsePromptVariantService } from './response-prompt-variant.service';
import { ResponseTextVariantService } from './response-text-variant.service';
import type {
  ResponseAnyVariantCreateData,
  ResponseAnyVariantCreateWithSubResourcesData,
  ResponseAnyVariantPatchData,
  ResponseTextVariantCreateOptions,
} from './response-variant.interface';
import { emptyResponseVariantFactory } from './response-variant.util';

@Injectable()
export class ResponseVariantService {
  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(ResponseVariantORM)
    protected readonly orm: ResponseVariantORM,
    @Inject(PromptORM)
    protected readonly promptORM: PromptORM,
    @Inject(ResponseDiscriminatorORM)
    protected readonly responseDiscriminatorORM: ResponseDiscriminatorORM,
    @Inject(LoguxService)
    protected readonly logux: LoguxService,
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
    userID: number,
    variants: AnyResponseVariantEntity[],
    {
      flush = true,
      action,
      discriminatorOrderInsertIndex = 1,
    }: { flush?: boolean; action: 'create' | 'delete'; discriminatorOrderInsertIndex?: number }
  ) {
    const responseDiscriminatorIDs = uniqCMSResourceIDs(
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
          variantOrder =
            discriminatorOrderInsertIndex === -1
              ? [...discriminator.variantOrder, ...variantIDs]
              : Utils.array.insertAll(discriminator.variantOrder, discriminatorOrderInsertIndex, variantIDs);
        } else {
          variantOrder = variantIDs;
        }
      } else {
        variantOrder = discriminator.variantOrder.filter((id) => !variantIDs.includes(id));
      }

      // eslint-disable-next-line no-param-reassign
      discriminator.updatedBy = ref(UserStubEntity, userID);
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

  findManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string): Promise<AnyResponseVariantEntity[]> {
    return this.orm.findManyByEnvironment(assistant, environmentID);
  }

  findManyJSONByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.orm.findAllJSON({ assistant, environmentID });
  }

  findManyByDiscriminators(discriminators: PKOrEntity<ResponseDiscriminatorEntity>[]): Promise<AnyResponseVariantEntity[]> {
    return this.orm.findManyByDiscriminators(discriminators);
  }

  /* Create */

  createOne(data: ResponseAnyVariantCreateData & { updatedByID: number | null }, options?: ORMMutateOptions) {
    return match(data)
      .with({ type: ResponseVariantType.JSON }, (data) => this.responseJSONVariant.createOne(data, options))
      .with({ type: ResponseVariantType.TEXT }, (data) => this.responseTextVariant.createOne(data, options))
      .with({ type: ResponseVariantType.PROMPT }, () => {
        throw new Error('Not implemented');
      })
      .exhaustive();
  }

  async createMany(data: Array<ResponseAnyVariantCreateData & { updatedByID: number | null }>, { flush = true }: ORMMutateOptions = {}) {
    const result = await Promise.all(data.map((item) => this.createOne(item, { flush: false })));

    if (flush) {
      await this.orm.em.flush();
    }

    return result;
  }

  createOneForUser(userID: number, data: ResponseAnyVariantCreateData, options?: ORMMutateOptions) {
    return match(data)
      .with({ type: ResponseVariantType.JSON }, (data) => this.responseJSONVariant.createOneForUser(userID, data, options))
      .with({ type: ResponseVariantType.TEXT }, (data) => this.responseTextVariant.createOneForUser(userID, data, options))
      .with({ type: ResponseVariantType.PROMPT }, () => {
        throw new Error('Not implemented');
      })
      .exhaustive();
  }

  async createManyForUser(userID: number, data: ResponseAnyVariantCreateData[], { flush = true }: ORMMutateOptions = {}) {
    const result = await Promise.all(data.map((item) => this.createOneForUser(userID, item, { flush: false })));

    if (flush) {
      await this.orm.em.flush();
    }

    return result;
  }

  async createManyWithSubResources(userID: number, data: ResponseAnyVariantCreateWithSubResourcesData[], { flush = true }: ORMMutateOptions = {}) {
    const prompts: PromptEntity[] = [];
    const responseVariants: AnyResponseVariantEntity[] = [];
    const responseAttachments: AnyResponseAttachmentEntity[] = [];

    // TODO: add condition
    for (const { attachments, ...variantData } of data) {
      const variantPayload: ResponseAnyVariantCreateData = { ...variantData, conditionID: null, attachmentOrder: [] };

      const responseVariant = await this.createOneForUser(userID, variantPayload, { flush: false });
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

  async createManyAndSync(userID: number, data: ResponseAnyVariantCreateWithSubResourcesData[], options?: ResponseTextVariantCreateOptions) {
    return this.postgresEM.transactional(async () => {
      const { prompts, responseVariants, responseAttachments } = await this.createManyWithSubResources(userID, data, { flush: false });

      const responseDiscriminators = await this.syncDiscriminators(userID, responseVariants, { ...options, flush: false, action: 'create' });

      await this.orm.em.flush();

      return {
        add: { prompts, responseVariants, responseAttachments },
        sync: { responseDiscriminators },
      };
    });
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
      // this.prompt.broadcastAddMany(authMeta, {
      //   add: Utils.object.pick(add, ['prompts']),
      // }),

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

  async createManyAndBroadcast(
    authMeta: AuthMetaPayload,
    data: ResponseAnyVariantCreateWithSubResourcesData[],
    options?: ResponseTextVariantCreateOptions
  ) {
    const result = await this.createManyAndSync(authMeta.userID, data, options);

    await this.broadcastAddMany(authMeta, result);

    return result.add.responseVariants;
  }

  /* Upsert */

  upsertMany(data: UpsertManyData<ResponseVariantORM>, options?: ORMMutateOptions) {
    return this.orm.upsertMany(data, options);
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
    userID: number,
    id: Primary<AnyResponseVariantEntity>,
    type: ResponseVariantType
  ): Promise<{
    add: { responseVariants: AnyResponseVariantEntity[] };
    sync: { responseDiscriminators: ResponseDiscriminatorEntity[] };
    delete: { responseVariants: AnyResponseVariantEntity[]; responseAttachments: AnyResponseAttachmentEntity[] };
  }> {
    return this.postgresEM.transactional(async () => {
      const responseVariant = await this.findOneOrFail(id);

      const [newResponseVariant, responseDiscriminator, relationsToDelete] = await Promise.all([
        this.createOneForUser(
          userID,
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
    });
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
    const result = await this.replaceWithTypeAndSync(authMeta.userID, id, type);

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

  async syncOnDelete(userID: number, variants: AnyResponseVariantEntity[], options?: ORMMutateOptions) {
    const responseDiscriminators = await this.syncDiscriminators(userID, variants, { ...options, action: 'delete' });

    return { responseDiscriminators };
  }

  async deleteManyAndSync(
    userID: number,
    ids: Primary<AnyResponseVariantEntity>[]
  ): Promise<{
    sync: { responseDiscriminators: ResponseDiscriminatorEntity[] };
    delete: { responseVariants: AnyResponseVariantEntity[]; responseAttachments: AnyResponseAttachmentEntity[] };
  }> {
    return this.postgresEM.transactional(async () => {
      const responseVariants = await this.findMany(ids);

      const relations = await this.collectRelationsToDelete(responseVariants);

      const sync = await this.syncOnDelete(userID, responseVariants, { flush: false });

      await this.deleteMany(responseVariants, { flush: false });

      await this.orm.em.flush();

      return {
        sync,
        delete: { ...relations, responseVariants },
      };
    });
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
    const result = await this.deleteManyAndSync(authMeta.userID, ids);

    await this.broadcastDeleteMany(authMeta, result);
  }
}

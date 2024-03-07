/* eslint-disable max-params */
import type { EntityManager } from '@mikro-orm/core';
import { Primary } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { AttachmentType } from '@voiceflow/dtos';
import { NotFoundException } from '@voiceflow/exception';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type {
  AnyAttachmentEntity,
  AnyResponseAttachmentEntity,
  AnyResponseVariantEntity,
  AssistantEntity,
  BaseResponseVariantEntity,
  ORMMutateOptions,
  PKOrEntity,
} from '@voiceflow/orm-designer';
import { DatabaseTarget, ResponseAttachmentORM, ResponseVariantORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { match } from 'ts-pattern';

import { EntitySerializer, UpsertManyData } from '@/common';
import { uniqCMSResourceIDs } from '@/utils/cms.util';

import { assistantBroadcastContext, groupByAssistant, toEntityID, toEntityIDs } from '../../common/utils';
import type { ResponseAnyAttachmentCreateData, ResponseAnyAttachmentReplaceData } from './response-attachment.interface';
import { ResponseCardAttachmentService } from './response-card-attachment.service';
import { ResponseMediaAttachmentService } from './response-media-attachment.service';

@Injectable()
export class ResponseAttachmentService {
  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(ResponseAttachmentORM)
    protected readonly orm: ResponseAttachmentORM,
    @Inject(ResponseVariantORM)
    protected readonly responseVariantORM: ResponseVariantORM,
    @Inject(LoguxService)
    protected readonly logux: LoguxService,
    @Inject(ResponseCardAttachmentService)
    protected readonly responseCardAttachment: ResponseCardAttachmentService,
    @Inject(ResponseMediaAttachmentService)
    protected readonly responseMediaAttachment: ResponseMediaAttachmentService,
    @Inject(EntitySerializer)
    protected readonly entitySerializer: EntitySerializer
  ) {}

  /* Helpers */

  protected async syncResponseVariants(
    responseAttachments: AnyResponseAttachmentEntity[],
    { flush = true, action }: { flush?: boolean; action: 'create' | 'delete' }
  ): Promise<AnyResponseVariantEntity[]> {
    const variantIDs = uniqCMSResourceIDs(responseAttachments.map(({ variant }) => ({ id: variant.id, environmentID: variant.environmentID })));

    const responseVariants = await this.responseVariantORM.findMany(variantIDs);

    if (variantIDs.length !== responseVariants.length) {
      throw new NotFoundException("couldn't find response variants to sync");
    }

    const responseAttachmentsByVariantIDMap = responseAttachments.reduce<Record<string, typeof responseAttachments>>((acc, attachment) => {
      acc[attachment.variant.id] ??= [];
      acc[attachment.variant.id].push(attachment);

      return acc;
    }, {});

    responseVariants.forEach((responseVariant) => {
      const attachmentIDs = responseAttachmentsByVariantIDMap[responseVariant.id]?.map(toEntityID);

      if (!attachmentIDs?.length) {
        throw new NotFoundException("couldn't find response attachments for response variant to sync");
      }

      let attachmentOrder: string[];

      if (action === 'create') {
        if (responseVariant.attachmentOrder.length) {
          attachmentOrder = [...responseVariant.attachmentOrder, ...attachmentIDs];
        } else {
          attachmentOrder = attachmentIDs;
        }
      } else {
        attachmentOrder = responseVariant.attachmentOrder.filter((id) => !attachmentIDs.includes(id));
      }

      // eslint-disable-next-line no-param-reassign
      responseVariant.attachmentOrder = attachmentOrder;
    });

    if (flush) {
      await this.orm.em.flush();
    }

    return responseVariants;
  }

  async broadcastSync(authMeta: AuthMetaPayload, { sync }: { sync: { responseVariants: AnyResponseVariantEntity[] } }) {
    await Promise.all(
      groupByAssistant(sync.responseVariants).flatMap((variants) =>
        variants.map((variant) =>
          this.logux.processAs(
            Actions.ResponseVariant.PatchOne({
              id: variant.id,
              patch: { attachmentOrder: variant.attachmentOrder },
              context: assistantBroadcastContext(variant),
            }),
            authMeta
          )
        )
      )
    );
  }

  /* Find */

  findMany(ids: Primary<AnyResponseAttachmentEntity>[]): Promise<AnyResponseAttachmentEntity[]> {
    return this.orm.findMany(ids);
  }

  findOneOrFail(id: Primary<AnyResponseAttachmentEntity>, type?: AttachmentType): Promise<AnyResponseAttachmentEntity> {
    return match(type)
      .with(AttachmentType.CARD, () => this.responseCardAttachment.findOneOrFail(id))
      .with(AttachmentType.MEDIA, () => this.responseMediaAttachment.findOneOrFail(id))
      .otherwise(() => this.orm.findOneOrFail(id));
  }

  findManyByVariants(variants: PKOrEntity<BaseResponseVariantEntity>[]): Promise<AnyResponseAttachmentEntity[]> {
    return this.orm.findManyByVariants(variants);
  }

  findManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string): Promise<AnyResponseAttachmentEntity[]> {
    return this.orm.findManyByEnvironment(assistant, environmentID);
  }

  findManyJSONByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.orm.findAllJSON({ assistant, environmentID });
  }

  async findManyByAttachments(attachments: PKOrEntity<AnyAttachmentEntity>[]): Promise<AnyResponseAttachmentEntity[]> {
    return (
      await Promise.all([
        this.responseCardAttachment.findManyByCardAttachments(attachments),
        this.responseMediaAttachment.findManyByMediaAttachments(attachments),
      ])
    ).flat();
  }

  /* Create */

  createOne(data: ResponseAnyAttachmentCreateData, options?: ORMMutateOptions) {
    return match(data)
      .with({ type: AttachmentType.CARD }, (data) => this.responseCardAttachment.createOne(data, options))
      .with({ type: AttachmentType.MEDIA }, (data) => this.responseMediaAttachment.createOne(data, options))
      .exhaustive();
  }

  async createMany(data: ResponseAnyAttachmentCreateData[], { flush = true }: ORMMutateOptions = {}) {
    const result = await Promise.all(data.map((item) => this.createOne(item, { flush: false })));

    if (flush) {
      await this.orm.em.flush();
    }

    return result;
  }

  async createManyAndSync(data: ResponseAnyAttachmentCreateData[]) {
    return this.postgresEM.transactional(async () => {
      const responseAttachments = await this.createMany(data, { flush: false });
      const responseVariants = await this.syncResponseVariants(responseAttachments, { flush: false, action: 'create' });

      await this.orm.em.flush();

      return {
        add: { responseAttachments },
        sync: { responseVariants },
      };
    });
  }

  async broadcastAddMany(
    authMeta: AuthMetaPayload,
    {
      add,
      sync,
    }: {
      add: { responseAttachments: AnyResponseAttachmentEntity[] };
      sync: { responseVariants: AnyResponseVariantEntity[] };
    }
  ) {
    await Promise.all([
      ...groupByAssistant(add.responseAttachments).map((attachments) =>
        this.logux.processAs(
          Actions.ResponseAttachment.AddMany({
            data: this.entitySerializer.iterable(attachments),
            context: assistantBroadcastContext(attachments[0]),
          }),
          authMeta
        )
      ),
      this.broadcastSync(authMeta, { sync }),
    ]);
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: ResponseAnyAttachmentCreateData[]) {
    const result = await this.createManyAndSync(data);

    await this.broadcastAddMany(authMeta, result);

    return result.add.responseAttachments;
  }

  /* Upsert */

  upsertMany(data: UpsertManyData<ResponseAttachmentORM>, options?: ORMMutateOptions) {
    return this.orm.upsertMany(data, options);
  }

  /* Update */

  async replaceOneAndBroadcast(
    authMeta: AuthMetaPayload,
    { type, variantID, environmentID, newAttachmentID, oldResponseAttachmentID }: ResponseAnyAttachmentReplaceData
  ) {
    const { variant, oldAttachment, newAttachment } = await this.postgresEM.transactional(async (em) => {
      const [variant, oldAttachment] = await Promise.all([
        this.responseVariantORM.findOneOrFail({ id: variantID, environmentID }),
        this.findOneOrFail({ id: oldResponseAttachmentID, environmentID }, type),
      ]);

      if (!variant.attachmentOrder.includes(oldAttachment.id)) {
        throw new NotFoundException('attachment not found in variant');
      }

      const newAttachment = await this.createOne(
        type === AttachmentType.CARD
          ? { type, cardID: newAttachmentID, variantID, assistantID: oldAttachment.assistant.id, environmentID: oldAttachment.environmentID }
          : { type, mediaID: newAttachmentID, variantID, assistantID: oldAttachment.assistant.id, environmentID: oldAttachment.environmentID },
        { flush: false }
      );

      await this.deleteOne(oldAttachment, { flush: false });

      variant.attachmentOrder = variant.attachmentOrder.map((id) => (id === oldAttachment.id ? newAttachment.id : id));

      await em.flush();

      return {
        variant,
        oldAttachment,
        newAttachment,
      };
    });

    await Promise.all([
      this.logux.processAs(
        Actions.ResponseAttachment.AddOne({
          data: this.entitySerializer.nullable(newAttachment),
          context: assistantBroadcastContext(variant),
        }),
        authMeta
      ),
      this.broadcastSync(authMeta, { sync: { responseVariants: [variant] } }),
      this.logux.processAs(
        Actions.ResponseAttachment.DeleteOne({
          id: oldAttachment.id,
          context: assistantBroadcastContext(variant),
        }),
        authMeta
      ),
    ]);
  }

  /* Delete */

  deleteOne(entity: PKOrEntity<AnyResponseAttachmentEntity>, options?: ORMMutateOptions) {
    return this.orm.deleteOne(entity, options);
  }

  deleteMany(entities: PKOrEntity<AnyResponseAttachmentEntity>[], options?: ORMMutateOptions) {
    return this.orm.deleteMany(entities, options);
  }

  async syncOnDelete(
    attachments: AnyResponseAttachmentEntity[],
    options?: ORMMutateOptions
  ): Promise<{ responseVariants: AnyResponseVariantEntity[] }> {
    const responseVariants = await this.syncResponseVariants(attachments, { ...options, action: 'delete' });

    return { responseVariants };
  }

  async deleteManyAndSync(ids: Primary<AnyResponseAttachmentEntity>[]): Promise<{
    sync: { responseVariants: AnyResponseVariantEntity[] };
    delete: { responseAttachments: AnyResponseAttachmentEntity[] };
  }> {
    return this.postgresEM.transactional(async () => {
      const responseAttachments = await this.findMany(ids);

      const sync = await this.syncOnDelete(responseAttachments, { flush: false });

      await this.deleteMany(responseAttachments, { flush: false });

      await this.orm.em.flush();

      return {
        sync,
        delete: { responseAttachments },
      };
    });
  }

  async broadcastDeleteMany(
    authMeta: AuthMetaPayload,
    {
      sync,
      delete: del,
    }: {
      sync: { responseVariants: AnyResponseVariantEntity[] };
      delete: { responseAttachments: AnyResponseAttachmentEntity[] };
    }
  ) {
    await Promise.all([
      this.broadcastSync(authMeta, { sync }),
      ...groupByAssistant(del.responseAttachments).map((attachments) =>
        this.logux.processAs(
          Actions.ResponseAttachment.DeleteMany({
            ids: toEntityIDs(attachments),
            context: assistantBroadcastContext(attachments[0]),
          }),
          authMeta
        )
      ),
    ]);
  }

  async deleteManyAndBroadcast(authMeta: AuthMetaPayload, ids: Primary<AnyResponseAttachmentEntity>[]) {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(authMeta, result);
  }
}

/* eslint-disable max-params */
import type { EntityManager } from '@mikro-orm/core';
import { Primary } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { AnyAttachment, CardButton } from '@voiceflow/dtos';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type {
  AnyAttachmentEntity,
  AnyResponseAttachmentEntity,
  AnyResponseVariantEntity,
  AssistantEntity,
  CardButtonEntity,
  ORMMutateOptions,
  PKOrEntity,
  ToJSONWithForeignKeys,
} from '@voiceflow/orm-designer';
import { AttachmentType, DatabaseTarget } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { match } from 'ts-pattern';

import { EntitySerializer } from '@/common';
import { assistantBroadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';
import { ResponseAttachmentService } from '@/response/response-attachment/response-attachment.service';
import { cloneManyEntities } from '@/utils/entity.util';

import type { AttachmentAnyImportData, AttachmentCreateData, AttachmentPatchData } from './attachment.interface';
import { CardAttachmentService } from './card-attachment.service';
import { CardButtonService } from './card-button/card-button.service';
import { AttachmentExportImportDataDTO } from './dtos/attachment-export-import-data.dto';
import { MediaAttachmentService } from './media-attachment.service';

@Injectable()
export class AttachmentService {
  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(CardButtonService)
    protected readonly cardButton: CardButtonService,
    @Inject(CardAttachmentService)
    protected readonly cardAttachment: CardAttachmentService,
    @Inject(MediaAttachmentService)
    protected readonly mediaAttachment: MediaAttachmentService,
    @Inject(ResponseAttachmentService)
    protected readonly responseAttachment: ResponseAttachmentService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {}

  /* Find */

  async findOne(id: Primary<AnyAttachmentEntity>, type: AttachmentType) {
    return match(type)
      .with(AttachmentType.CARD, () => this.cardAttachment.findOneOrFail(id))
      .with(AttachmentType.MEDIA, () => this.mediaAttachment.findOneOrFail(id))
      .exhaustive();
  }

  async findMany(ids: Primary<AnyAttachmentEntity>[]) {
    return (await Promise.all([this.cardAttachment.findMany(ids), this.mediaAttachment.findMany(ids)])).flat();
  }

  async findManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return (
      await Promise.all([
        this.cardAttachment.findManyByEnvironment(assistant, environmentID),
        this.mediaAttachment.findManyByEnvironment(assistant, environmentID),
      ])
    ).flat();
  }

  async findManyWithSubResourcesByEnvironment(assistantID: string, environmentID: string) {
    const [attachments, cardButtons] = await Promise.all([
      this.findManyByEnvironment(assistantID, environmentID),
      this.cardButton.findManyByEnvironment(assistantID, environmentID),
    ]);

    return {
      attachments,
      cardButtons,
    };
  }

  /* Upsert */

  async upsertOne(data: AttachmentAnyImportData, options?: ORMMutateOptions) {
    return match(data)
      .with({ type: AttachmentType.CARD }, ({ type: _, ...data }) => this.cardAttachment.upsertOne(data, options))
      .with({ type: AttachmentType.MEDIA }, ({ type: _, ...data }) => this.mediaAttachment.upsertOne(data, options))
      .exhaustive();
  }

  async upsertMany(data: AttachmentAnyImportData[], { flush = true }: ORMMutateOptions = {}) {
    const cardAttachmentsData = data.filter((item) => item.type === AttachmentType.CARD).map(({ type: _, ...data }) => data);
    const mediaAttachmentsData = data.filter((item) => item.type === AttachmentType.MEDIA).map(({ type: _, ...data }) => data);

    const [cardAttachment, mediaAttachments] = await Promise.all([
      this.cardAttachment.upsertMany(cardAttachmentsData, { flush: false }),
      this.mediaAttachment.upsertMany(mediaAttachmentsData, { flush: false }),
    ]);

    if (flush) {
      await this.postgresEM.flush();
    }

    return [...cardAttachment, ...mediaAttachments];
  }

  async upsertManyWithSubResources(
    data: { attachments: AnyAttachment[]; cardButtons: CardButton[] },
    meta: { userID: number; assistantID: string; environmentID: string }
  ) {
    const { attachments, cardButtons } = this.prepareImportData(data, meta);

    await this.upsertMany(attachments);
    await this.cardButton.upsertMany(cardButtons);
  }

  /* Update */

  async patchOneForUser(userID: number, id: Primary<AnyAttachmentEntity>, patch: AttachmentPatchData) {
    await match(patch)
      .with({ type: AttachmentType.CARD }, ({ type: _, ...patch }) => this.cardAttachment.patchOneForUser(userID, id, patch))
      .with({ type: AttachmentType.MEDIA }, ({ type: _, ...patch }) => this.mediaAttachment.patchOneForUser(userID, id, patch))
      .exhaustive();
  }

  async patchManyForUser(userID: number, ids: Primary<AnyAttachmentEntity>[], patch: AttachmentPatchData) {
    await match(patch)
      .with({ type: AttachmentType.CARD }, ({ type: _, ...patch }) => this.cardAttachment.patchManyForUser(userID, ids, patch))
      .with({ type: AttachmentType.MEDIA }, ({ type: _, ...patch }) => this.mediaAttachment.patchManyForUser(userID, ids, patch))
      .exhaustive();
  }

  /* Export */

  prepareExportData(
    {
      attachments,
      cardButtons,
    }: {
      attachments: AnyAttachmentEntity[];
      cardButtons: CardButtonEntity[];
    },
    { backup }: { backup?: boolean } = {}
  ): AttachmentExportImportDataDTO {
    if (backup) {
      return {
        attachments: this.entitySerializer.iterable(attachments),
        cardButtons: this.entitySerializer.iterable(cardButtons),
      };
    }

    return {
      attachments: this.entitySerializer.iterable(attachments, {
        omit: ['updatedAt', 'updatedByID', 'assistantID', 'environmentID'],
      }) as AttachmentExportImportDataDTO['attachments'],
      cardButtons: this.entitySerializer.iterable(cardButtons, { omit: ['updatedAt', 'updatedByID', 'assistantID', 'environmentID'] }),
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
    const { attachments: sourceAttachments, cardButtons: sourceCardButtons } = await this.findManyWithSubResourcesByEnvironment(
      sourceAssistantID,
      sourceEnvironmentID
    );

    const result = await this.importManyWithSubResources(
      {
        attachments: cloneManyEntities(sourceAttachments, { assistantID: targetAssistantID, environmentID: targetEnvironmentID }),
        cardButtons: cloneManyEntities(sourceCardButtons, { assistantID: targetAssistantID, environmentID: targetEnvironmentID }),
      },
      { flush: false }
    );

    if (flush) {
      await this.postgresEM.flush();
    }

    return result;
  }

  /* Import */

  prepareImportData(
    { attachments, cardButtons }: AttachmentExportImportDataDTO,
    { userID, backup, assistantID, environmentID }: { userID: number; backup?: boolean; assistantID: string; environmentID: string }
  ): { attachments: AttachmentAnyImportData[]; cardButtons: ToJSONWithForeignKeys<CardButtonEntity>[] } {
    const createdAt = new Date().toJSON();

    if (backup) {
      return {
        attachments: attachments.map((item) => ({
          ...item,
          updatedAt: item.updatedAt ?? createdAt,
          updatedByID: item.updatedByID ?? userID,
          assistantID,
          environmentID,
        })),
        cardButtons: cardButtons.map((item) => ({
          ...item,
          updatedAt: item.updatedAt ?? createdAt,
          updatedByID: item.updatedByID ?? userID,
          assistantID,
          environmentID,
        })),
      };
    }

    return {
      attachments: attachments.map((item) => ({
        ...item,
        createdAt,
        updatedAt: createdAt,
        updatedByID: userID,
        assistantID,
        environmentID,
      })),

      cardButtons: cardButtons.map((item) => ({
        ...item,
        createdAt,
        updatedAt: createdAt,
        updatedByID: userID,
        assistantID,
        environmentID,
      })),
    };
  }

  async importManyWithSubResources(
    data: {
      attachments: Array<AttachmentCreateData & { updatedByID: number | null }>;
      cardButtons: ToJSONWithForeignKeys<CardButtonEntity>[];
    },
    { flush = true }: ORMMutateOptions = {}
  ) {
    const [attachments, cardButtons] = await Promise.all([
      this.createMany(data.attachments, { flush: false }),
      this.cardButton.createMany(data.cardButtons, { flush: false }),
    ]);

    if (flush) {
      await this.postgresEM.flush();
    }

    return {
      attachments,
      cardButtons,
    };
  }

  /* Create */

  async createOne(data: AttachmentCreateData & { updatedByID: number | null }, options?: ORMMutateOptions) {
    return match(data)
      .with({ type: AttachmentType.CARD }, ({ type: _, ...data }) => this.cardAttachment.createOne(data, options))
      .with({ type: AttachmentType.MEDIA }, ({ type: _, ...data }) => this.mediaAttachment.createOne(data, options))
      .exhaustive();
  }

  async createMany(data: Array<AttachmentCreateData & { updatedByID: number | null }>, { flush = true }: ORMMutateOptions = {}) {
    const attachments = await Promise.all(data.map((item) => this.createOne(item, { flush: false })));

    if (flush) {
      await this.postgresEM.flush();
    }

    return attachments;
  }

  async createOneForUser(userID: number, data: AttachmentCreateData, options?: ORMMutateOptions) {
    return match(data)
      .with({ type: AttachmentType.CARD }, ({ type: _, ...data }) => this.cardAttachment.createOneForUser(userID, data, options))
      .with({ type: AttachmentType.MEDIA }, ({ type: _, ...data }) => this.mediaAttachment.createOneForUser(userID, data, options))
      .exhaustive();
  }

  async createManyForUser(userID: number, data: AttachmentCreateData[], { flush = true }: ORMMutateOptions = {}) {
    const attachments = await Promise.all(data.map((item) => this.createOneForUser(userID, item, { flush: false })));

    if (flush) {
      await this.postgresEM.flush();
    }

    return attachments;
  }

  async createManyAndSync(userID: number, data: AttachmentCreateData[]) {
    return this.postgresEM.transactional(async () => {
      const attachments = await this.createManyForUser(userID, data);

      return {
        add: { attachments },
      };
    });
  }

  async broadcastAddMany(authMeta: AuthMetaPayload, { add }: { add: { attachments: AnyAttachmentEntity[] } }) {
    await Promise.all(
      groupByAssistant(add.attachments).map((attachments) =>
        this.logux.processAs(
          Actions.Attachment.AddMany({
            data: this.entitySerializer.iterable(attachments),
            context: assistantBroadcastContext(attachments[0]),
          }),
          authMeta
        )
      )
    );
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: AttachmentCreateData[]) {
    const result = await this.createManyAndSync(authMeta.userID, data);

    await this.broadcastAddMany(authMeta, result);

    return result.add.attachments;
  }

  /* Delete */

  async deleteMany(ids: PKOrEntity<AnyAttachmentEntity>[], { flush = true }: ORMMutateOptions = {}) {
    await Promise.all([this.cardAttachment.deleteMany(ids, { flush }), this.mediaAttachment.deleteMany(ids, { flush })]);
  }

  async deleteManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    await Promise.all([
      this.cardAttachment.deleteManyByEnvironment(assistant, environmentID),
      this.mediaAttachment.deleteManyByEnvironment(assistant, environmentID),
    ]);
  }

  async collectRelationsToDelete(attachments: PKOrEntity<AnyAttachmentEntity>[]) {
    const [cardButtons, responseAttachments] = await Promise.all([
      this.cardButton.findManyByCardAttachments(attachments),
      this.responseAttachment.findManyByAttachments(attachments),
    ]);

    return {
      cardButtons,
      responseAttachments,
    };
  }

  async deleteManyAndSync(ids: Primary<AnyAttachmentEntity>[]) {
    return this.postgresEM.transactional(async () => {
      const attachments = await this.findMany(ids);
      const relations = await this.collectRelationsToDelete(attachments);

      const sync = await this.responseAttachment.syncOnDelete(relations.responseAttachments, { flush: false });

      await this.deleteMany(attachments, { flush: false });

      await this.postgresEM.flush();

      return {
        sync,
        delete: { ...relations, attachments },
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
      delete: {
        attachments: AnyAttachmentEntity[];
        cardButtons: CardButtonEntity[];
        responseAttachments: AnyResponseAttachmentEntity[];
      };
    }
  ) {
    await Promise.all([
      this.responseAttachment.broadcastDeleteMany(authMeta, {
        sync: Utils.object.pick(sync, ['responseVariants']),
        delete: Utils.object.pick(del, ['responseAttachments']),
      }),

      this.cardButton.broadcastDeleteMany(authMeta, {
        // no need tp sync cardAttachments, because they are deleted with attachments
        sync: { cardAttachments: [] },
        delete: Utils.object.pick(del, ['cardButtons']),
      }),

      ...groupByAssistant(del.attachments).map((attachments) =>
        this.logux.processAs(
          Actions.Attachment.DeleteMany({
            ids: toEntityIDs(attachments),
            context: assistantBroadcastContext(attachments[0]),
          }),
          authMeta
        )
      ),
    ]);
  }

  async deleteManyAndBroadcast(authMeta: AuthMetaPayload, ids: Primary<AnyAttachmentEntity>[]): Promise<void> {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(authMeta, result);
  }
}

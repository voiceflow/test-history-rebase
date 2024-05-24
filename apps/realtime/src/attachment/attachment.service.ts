/* eslint-disable max-params */
import type { EntityManager } from '@mikro-orm/core';
import { Primary } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { AnyAttachment, AttachmentType, CardButton } from '@voiceflow/dtos';
import { LoguxService } from '@voiceflow/nestjs-logux';
import type { AnyAttachmentEntity, AnyResponseVariantObject, CardButtonObject } from '@voiceflow/orm-designer';
import { AnyResponseAttachmentObject, DatabaseTarget } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { match } from 'ts-pattern';

import { cmsBroadcastContext, injectAssistantAndEnvironmentIDs, toPostgresEntityIDs } from '@/common/utils';
import { ResponseAttachmentService } from '@/response/response-attachment/response-attachment.service';
import { CMSBroadcastMeta, CMSContext } from '@/types';

import type { AnyAttachmentCreateData, AnyAttachmentObjectWithType, AttachmentPatchData } from './attachment.interface';
import { CardAttachmentService } from './card-attachment.service';
import { CardButtonService } from './card-button/card-button.service';
import { AttachmentExportImportDataDTO } from './dtos/attachment-export-import-data.dto';
import { MediaAttachmentService } from './media-attachment.service';

@Injectable()
export class AttachmentService {
  toJSON = (data: AnyAttachmentObjectWithType) =>
    data.type === AttachmentType.CARD
      ? this.injectType(data.type)(this.cardAttachment.toJSON(data))
      : this.injectType(data.type)(this.mediaAttachment.toJSON(data));

  fromJSON = (data: AnyAttachment) =>
    data.type === AttachmentType.CARD
      ? this.injectType(data.type)(this.cardAttachment.fromJSON(data))
      : this.injectType(data.type)(this.mediaAttachment.fromJSON(data));

  mapToJSON = (data: AnyAttachmentObjectWithType[]) => data.map(this.toJSON);

  mapFromJSON = (data: AnyAttachment[]) => data.map(this.fromJSON);

  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    protected readonly postgresEM: EntityManager,
    @Inject(LoguxService)
    protected readonly logux: LoguxService,
    @Inject(CardButtonService)
    protected readonly cardButton: CardButtonService,
    @Inject(CardAttachmentService)
    protected readonly cardAttachment: CardAttachmentService,
    @Inject(MediaAttachmentService)
    protected readonly mediaAttachment: MediaAttachmentService,
    @Inject(ResponseAttachmentService)
    protected readonly responseAttachment: ResponseAttachmentService
  ) {}

  /* Utils */

  protected omitType = <Data extends { type: AttachmentType }>(data: Data) => Utils.object.omit(data, ['type']);

  protected injectType = <Type extends AttachmentType>(type: Type) => {
    return <Data extends object>(data: Data): Data & { type: Type } => ({ ...data, type });
  };

  protected groupByType<Data extends AnyAttachment[] | AnyAttachmentCreateData[]>(attachments: Data) {
    const cardAttachmentsData: Array<Data[number] & { type: typeof AttachmentType.CARD }> = [];
    const mediaAttachmentsData: Array<Data[number] & { type: typeof AttachmentType.MEDIA }> = [];

    attachments.forEach((attachment) => {
      if (attachment.type === AttachmentType.CARD) {
        cardAttachmentsData.push(attachment);
      } else {
        mediaAttachmentsData.push(attachment);
      }
    });

    return {
      cardAttachmentsData,
      mediaAttachmentsData,
    };
  }

  /* Find */

  async findOneByType(id: Primary<AnyAttachmentEntity>, type: AttachmentType): Promise<AnyAttachmentObjectWithType> {
    return match(type)
      .with(AttachmentType.CARD, (type) => this.cardAttachment.findOneOrFail(id).then(this.injectType(type)))
      .with(AttachmentType.MEDIA, (type) => this.mediaAttachment.findOneOrFail(id).then(this.injectType(type)))
      .exhaustive();
  }

  async findManyByEnvironmentAndIDs(environmentID: string, ids: string[]): Promise<AnyAttachmentObjectWithType[]> {
    const [cardAttachments, mediaAttachments] = await Promise.all([
      this.cardAttachment.findManyByEnvironmentAndIDs(environmentID, ids),
      this.mediaAttachment.findManyByEnvironmentAndIDs(environmentID, ids),
    ]);

    return [...cardAttachments.map(this.injectType(AttachmentType.CARD)), ...mediaAttachments.map(this.injectType(AttachmentType.MEDIA))];
  }

  async findManyByEnvironment(environmentID: string): Promise<AnyAttachmentObjectWithType[]> {
    const [cardAttachments, mediaAttachments] = await Promise.all([
      this.cardAttachment.findManyByEnvironment(environmentID),
      this.mediaAttachment.findManyByEnvironment(environmentID),
    ]);

    return [...cardAttachments.map(this.injectType(AttachmentType.CARD)), ...mediaAttachments.map(this.injectType(AttachmentType.MEDIA))];
  }

  async findManyWithSubResourcesByEnvironment(environmentID: string) {
    const [attachments, cardButtons] = await Promise.all([
      this.findManyByEnvironment(environmentID),
      this.cardButton.findManyByEnvironment(environmentID),
    ]);

    return {
      attachments,
      cardButtons,
    };
  }

  /* Upsert */

  async upsertOne(data: AnyAttachmentObjectWithType): Promise<AnyAttachmentObjectWithType> {
    return match(data)
      .with({ type: AttachmentType.CARD }, ({ type, ...data }) => this.cardAttachment.upsertOne(data).then(this.injectType(type)))
      .with({ type: AttachmentType.MEDIA }, ({ type, ...data }) => this.mediaAttachment.upsertOne(data).then(this.injectType(type)))
      .exhaustive();
  }

  async upsertMany(data: AnyAttachmentObjectWithType[]): Promise<AnyAttachmentObjectWithType[]> {
    const { cardAttachmentsData, mediaAttachmentsData } = this.groupByType(data);

    const [cardAttachments, mediaAttachments] = await Promise.all([
      this.cardAttachment.upsertMany(cardAttachmentsData.map(this.omitType)),
      this.mediaAttachment.upsertMany(mediaAttachmentsData.map(this.omitType)),
    ]);

    return [...cardAttachments.map(this.injectType(AttachmentType.CARD)), ...mediaAttachments.map(this.injectType(AttachmentType.MEDIA))];
  }

  async upsertManyWithSubResources(
    data: { attachments: AnyAttachment[]; cardButtons: CardButton[] },
    meta: { userID: number; assistantID: string; environmentID: string }
  ) {
    const { attachments, cardButtons } = this.prepareImportData(data, meta);

    await this.upsertMany(this.mapFromJSON(attachments));
    await this.cardButton.upsertMany(this.cardButton.mapFromJSON(cardButtons));
  }

  /* Update */

  async patchOneForUser(userID: number, id: Primary<AnyAttachmentEntity>, patch: AttachmentPatchData) {
    await match(patch)
      .with({ type: AttachmentType.CARD }, (patch) => this.cardAttachment.patchOneForUser(userID, id, this.omitType(patch)))
      .with({ type: AttachmentType.MEDIA }, (patch) => this.mediaAttachment.patchOneForUser(userID, id, this.omitType(patch)))
      .exhaustive();
  }

  async patchManyForUser(userID: number, ids: Primary<AnyAttachmentEntity>[], patch: AttachmentPatchData) {
    await match(patch)
      .with({ type: AttachmentType.CARD }, (patch) => this.cardAttachment.patchManyForUser(userID, ids, this.omitType(patch)))
      .with({ type: AttachmentType.MEDIA }, (patch) => this.mediaAttachment.patchManyForUser(userID, ids, this.omitType(patch)))
      .exhaustive();
  }

  /* Export */

  toJSONWithSubResources({ attachments, cardButtons }: { attachments: AnyAttachmentObjectWithType[]; cardButtons: CardButtonObject[] }) {
    return {
      cardButtons: this.cardButton.mapToJSON(cardButtons),
      attachments: this.mapToJSON(attachments),
    };
  }

  fromJSONWithSubResources({ attachments, cardButtons }: AttachmentExportImportDataDTO) {
    return {
      cardButtons: this.cardButton.mapFromJSON(cardButtons),
      attachments: this.mapFromJSON(attachments),
    };
  }

  prepareExportData(
    data: { attachments: AnyAttachmentObjectWithType[]; cardButtons: CardButtonObject[] },
    { backup }: { backup?: boolean } = {}
  ): AttachmentExportImportDataDTO {
    const json = this.toJSONWithSubResources(data);

    if (backup) {
      return json;
    }

    return {
      attachments: json.attachments.map((item) =>
        Utils.object.omit(item, ['updatedAt', 'updatedByID', 'assistantID', 'environmentID'])
      ) as AttachmentExportImportDataDTO['attachments'],

      cardButtons: json.cardButtons.map((item) => Utils.object.omit(item, ['updatedAt', 'updatedByID', 'assistantID', 'environmentID'])),
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
    const { attachments: sourceAttachments, cardButtons: sourceCardButtons } = await this.findManyWithSubResourcesByEnvironment(sourceEnvironmentID);

    const injectContext = { assistantID: targetAssistantID, environmentID: targetEnvironmentID };

    return this.importManyWithSubResources({
      attachments: sourceAttachments.map(injectAssistantAndEnvironmentIDs(injectContext)),
      cardButtons: sourceCardButtons.map(injectAssistantAndEnvironmentIDs(injectContext)),
    });
  }

  /* Import */

  prepareImportData(
    { attachments, cardButtons }: AttachmentExportImportDataDTO,
    { userID, backup, assistantID, environmentID }: { userID: number; backup?: boolean; assistantID: string; environmentID: string }
  ): { attachments: AnyAttachment[]; cardButtons: CardButton[] } {
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

  async importManyWithSubResources(data: {
    attachments: Array<AnyAttachmentCreateData & { updatedByID: number | null; assistantID: string; environmentID: string }>;
    cardButtons: CardButtonObject[];
  }) {
    const attachments = await this.createMany(data.attachments);
    const cardButtons = await this.cardButton.createMany(data.cardButtons);

    return {
      attachments,
      cardButtons,
    };
  }

  async importManyWithSubResourcesFromJSON({ attachments, cardButtons }: AttachmentExportImportDataDTO) {
    await this.importManyWithSubResources(
      this.fromJSONWithSubResources({
        attachments,
        cardButtons,
      })
    );
  }

  /* Create */

  async createMany(data: Array<AnyAttachmentCreateData & { updatedByID: number | null; assistantID: string; environmentID: string }>) {
    const { cardAttachmentsData, mediaAttachmentsData } = this.groupByType(data);

    const [cardAttachments, mediaAttachments] = await Promise.all([
      this.cardAttachment.createMany(cardAttachmentsData.map(this.omitType)),
      this.mediaAttachment.createMany(mediaAttachmentsData.map(this.omitType)),
    ]);

    return [...cardAttachments.map(this.injectType(AttachmentType.CARD)), ...mediaAttachments.map(this.injectType(AttachmentType.MEDIA))];
  }

  async createManyForUser(userID: number, data: Array<AnyAttachmentCreateData & { assistantID: string; environmentID: string }>) {
    const { cardAttachmentsData, mediaAttachmentsData } = this.groupByType(data);

    const [cardAttachments, mediaAttachments] = await Promise.all([
      this.cardAttachment.createManyForUser(userID, cardAttachmentsData.map(this.omitType)),
      this.mediaAttachment.createManyForUser(userID, mediaAttachmentsData.map(this.omitType)),
    ]);

    return [...cardAttachments.map(this.injectType(AttachmentType.CARD)), ...mediaAttachments.map(this.injectType(AttachmentType.MEDIA))];
  }

  async createManyAndSync(data: AnyAttachmentCreateData[], { userID, context }: { userID: number; context: CMSContext }) {
    return this.postgresEM.transactional(async () => {
      const attachments = await this.createManyForUser(userID, data.map(injectAssistantAndEnvironmentIDs(context)));

      return {
        add: { attachments },
      };
    });
  }

  async broadcastAddMany({ add }: { add: { attachments: AnyAttachmentObjectWithType[] } }, meta: CMSBroadcastMeta) {
    await this.logux.processAs(
      Actions.Attachment.AddMany({
        data: this.mapToJSON(add.attachments),
        context: cmsBroadcastContext(meta.context),
      }),
      meta.auth
    );
  }

  async createManyAndBroadcast(data: AnyAttachmentCreateData[], meta: CMSBroadcastMeta) {
    const result = await this.createManyAndSync(data, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastAddMany(result, meta);

    return result.add.attachments;
  }

  /* Delete */

  async deleteManyByEnvironment(environmentID: string) {
    await Promise.all([this.cardAttachment.deleteManyByEnvironment(environmentID), this.mediaAttachment.deleteManyByEnvironment(environmentID)]);
  }

  async deleteManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    await Promise.all([
      this.cardAttachment.deleteManyByEnvironmentAndIDs(environmentID, ids),
      this.mediaAttachment.deleteManyByEnvironmentAndIDs(environmentID, ids),
    ]);
  }

  async collectRelationsToDelete(environmentID: string, attachmentIDs: string[]) {
    const [cardButtons, responseAttachments] = await Promise.all([
      this.cardButton.findManyByCardAttachments(environmentID, attachmentIDs),
      this.responseAttachment.findManyByAttachments(environmentID, attachmentIDs),
    ]);

    return {
      cardButtons,
      responseAttachments,
    };
  }

  async deleteManyAndSync(ids: string[], { userID, context }: { userID: number; context: CMSContext }) {
    return this.postgresEM.transactional(async () => {
      const [attachments, relations] = await Promise.all([
        this.findManyByEnvironmentAndIDs(context.environmentID, ids),
        this.collectRelationsToDelete(context.environmentID, ids),
      ]);

      const sync = await this.responseAttachment.syncOnDelete(relations.responseAttachments, { userID, context });

      await this.deleteManyByEnvironmentAndIDs(context.environmentID, ids);

      return {
        sync,
        delete: { ...relations, attachments },
      };
    });
  }

  async broadcastDeleteMany(
    {
      sync,
      delete: del,
    }: {
      sync: { responseVariants: AnyResponseVariantObject[] };
      delete: {
        attachments: AnyAttachmentObjectWithType[];
        cardButtons: CardButtonObject[];
        responseAttachments: AnyResponseAttachmentObject[];
      };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.responseAttachment.broadcastDeleteMany(
        {
          sync: Utils.object.pick(sync, ['responseVariants']),
          delete: Utils.object.pick(del, ['responseAttachments']),
        },
        meta
      ),

      this.cardButton.broadcastDeleteMany(
        {
          // no need tp sync cardAttachments, because they are deleted with attachments
          sync: { cardAttachments: [] },
          delete: Utils.object.pick(del, ['cardButtons']),
        },
        meta
      ),

      this.logux.processAs(
        Actions.Attachment.DeleteMany({
          ids: toPostgresEntityIDs(del.attachments),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),
    ]);
  }

  async deleteManyAndBroadcast(ids: string[], meta: CMSBroadcastMeta): Promise<void> {
    const result = await this.deleteManyAndSync(ids, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastDeleteMany(result, meta);
  }
}

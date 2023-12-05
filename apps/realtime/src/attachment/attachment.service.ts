/* eslint-disable max-params */
import type { MikroORM } from '@mikro-orm/core';
import { Primary } from '@mikro-orm/core';
import { getMikroORMToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
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
import { deepSetCreatorID } from '@/utils/creator.util';
import { cloneManyEntities } from '@/utils/entity.util';

import type { AttachmentAnyImportData, AttachmentCreateData, AttachmentPatchData } from './attachment.interface';
import { CardAttachmentService } from './card-attachment.service';
import { CardButtonService } from './card-button/card-button.service';
import { MediaAttachmentService } from './media-attachment.service';

@Injectable()
export class AttachmentService {
  constructor(
    @Inject(getMikroORMToken(DatabaseTarget.POSTGRES))
    private readonly orm: MikroORM,
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

  async findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return (
      await Promise.all([
        this.cardAttachment.findManyByAssistant(assistant, environmentID),
        this.mediaAttachment.findManyByAssistant(assistant, environmentID),
      ])
    ).flat();
  }

  async findManyWithSubResourcesByAssistant(assistantID: string, environmentID: string) {
    const [attachments, cardButtons] = await Promise.all([
      this.findManyByAssistant(assistantID, environmentID),
      this.cardButton.findManyByAssistant(assistantID, environmentID),
    ]);

    return {
      attachments,
      cardButtons,
    };
  }

  /* Update */

  async patchOne(id: Primary<AnyAttachmentEntity>, patch: AttachmentPatchData) {
    await match(patch)
      .with({ type: AttachmentType.CARD }, ({ type: _, ...patch }) => this.cardAttachment.patchOne(id, patch))
      .with({ type: AttachmentType.MEDIA }, ({ type: _, ...patch }) => this.mediaAttachment.patchOne(id, patch))
      .exhaustive();
  }

  async patchMany(ids: Primary<AnyAttachmentEntity>[], patch: AttachmentPatchData) {
    await match(patch)
      .with({ type: AttachmentType.CARD }, ({ type: _, ...patch }) => this.cardAttachment.patchMany(ids, patch))
      .with({ type: AttachmentType.MEDIA }, ({ type: _, ...patch }) => this.mediaAttachment.patchMany(ids, patch))
      .exhaustive();
  }

  /* Export */

  prepareExportData({ attachments, cardButtons }: { attachments: AnyAttachmentEntity[]; cardButtons: CardButtonEntity[] }) {
    return {
      attachments: this.entitySerializer.iterable(attachments),
      cardButtons: this.entitySerializer.iterable(cardButtons),
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
    const [{ attachments: sourceAttachments, cardButtons: sourceCardButtons }, targetAttachments] = await Promise.all([
      this.findManyWithSubResourcesByAssistant(assistantID, sourceEnvironmentID),
      this.findManyByAssistant(assistantID, targetEnvironmentID),
    ]);

    await this.deleteMany(targetAttachments, { flush: false });

    const result = await this.importManyWithSubResources(
      {
        attachments: cloneManyEntities(sourceAttachments, { environmentID: targetEnvironmentID }),
        cardButtons: cloneManyEntities(sourceCardButtons, { environmentID: targetEnvironmentID }),
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
    { attachments, cardButtons }: { attachments: AttachmentAnyImportData[]; cardButtons: ToJSONWithForeignKeys<CardButtonEntity>[] },
    { userID, backup, assistantID, environmentID }: { userID: number; backup?: boolean; assistantID: string; environmentID: string }
  ) {
    const createdAt = new Date().toJSON();

    return {
      attachments: attachments.map<AttachmentAnyImportData>((item) =>
        backup
          ? { ...item, assistantID, environmentID }
          : { ...deepSetCreatorID(item, userID), createdAt, updatedAt: createdAt, assistantID, environmentID }
      ),

      cardButtons: cardButtons.map<ToJSONWithForeignKeys<CardButtonEntity>>((item) =>
        backup
          ? { ...item, assistantID, environmentID }
          : { ...deepSetCreatorID(item, userID), createdAt, updatedAt: createdAt, assistantID, environmentID }
      ),
    };
  }

  async importManyWithSubResources(
    data: {
      attachments: AttachmentAnyImportData[];
      cardButtons: ToJSONWithForeignKeys<CardButtonEntity>[];
    },
    { flush = true }: ORMMutateOptions = {}
  ) {
    const [attachments, cardButtons] = await Promise.all([
      this.createMany(data.attachments, { flush: false }),
      this.cardButton.createMany(data.cardButtons, { flush: false }),
    ]);

    if (flush) {
      await this.orm.em.flush();
    }

    return {
      attachments,
      cardButtons,
    };
  }

  /* Create */

  async createOne(data: AttachmentCreateData, options?: ORMMutateOptions) {
    return match(data)
      .with({ type: AttachmentType.CARD }, ({ type: _, ...data }) => this.cardAttachment.createOne(data, options))
      .with({ type: AttachmentType.MEDIA }, ({ type: _, ...data }) => this.mediaAttachment.createOne(data, options))
      .exhaustive();
  }

  async createMany(data: AttachmentCreateData[], { flush = true }: ORMMutateOptions = {}) {
    const attachments = await Promise.all(data.map((item) => this.createOne(item, { flush: false })));

    if (flush) {
      await this.orm.em.flush();
    }

    return attachments;
  }

  async createManyAndSync(data: AttachmentCreateData[]) {
    const attachments = await this.createMany(data);

    return {
      add: { attachments },
    };
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
    const result = await this.createManyAndSync(data);

    await this.broadcastAddMany(authMeta, result);

    return result.add.attachments;
  }

  /* Delete */

  async deleteMany(ids: PKOrEntity<AnyAttachmentEntity>[], { flush = true }: ORMMutateOptions = {}) {
    await Promise.all([this.cardAttachment.deleteMany(ids, { flush }), this.mediaAttachment.deleteMany(ids, { flush })]);
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
    const attachments = await this.findMany(ids);
    const relations = await this.collectRelationsToDelete(attachments);

    const sync = await this.responseAttachment.syncOnDelete(relations.responseAttachments, { flush: false });

    await this.deleteMany(attachments, { flush: false });

    await this.orm.em.flush();

    return {
      sync,
      delete: { ...relations, attachments },
    };
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

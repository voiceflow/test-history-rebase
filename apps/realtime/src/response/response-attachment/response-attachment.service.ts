/* eslint-disable max-params */
import type { EntityManager } from '@mikro-orm/core';
import { Primary } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { AnyResponseAttachment, AttachmentType } from '@voiceflow/dtos';
import { NotFoundException } from '@voiceflow/exception';
import { LoguxService } from '@voiceflow/nestjs-logux';
import type {
  AnyResponseAttachmentEntity,
  AnyResponseAttachmentObject,
  AnyResponseVariantObject,
  CreateData,
} from '@voiceflow/orm-designer';
import { AnyResponseAttachmentORM, AnyResponseVariantORM, DatabaseTarget } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { match } from 'ts-pattern';

import { CMSBroadcastMeta, CMSContext } from '@/types';

import { cmsBroadcastContext, injectAssistantAndEnvironmentIDs, toPostgresEntityIDs } from '../../common/utils';
import type {
  ResponseAnyAttachmentCreateData,
  ResponseAnyAttachmentReplaceData,
} from './response-attachment.interface';
import { ResponseCardAttachmentService } from './response-card-attachment.service';
import { ResponseMediaAttachmentService } from './response-media-attachment.service';

@Injectable()
export class ResponseAttachmentService {
  toJSON = (data: AnyResponseAttachmentObject) =>
    data.type === AttachmentType.CARD
      ? this.responseCardAttachment.toJSON(data)
      : this.responseMediaAttachment.toJSON(data);

  fromJSON = (data: AnyResponseAttachment) =>
    data.type === AttachmentType.CARD
      ? this.responseCardAttachment.fromJSON(data)
      : this.responseMediaAttachment.fromJSON(data);

  mapToJSON = (data: AnyResponseAttachmentObject[]) => data.map(this.toJSON);

  mapFromJSON = (data: AnyResponseAttachment[]) => data.map(this.fromJSON);

  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(AnyResponseAttachmentORM)
    protected readonly orm: AnyResponseAttachmentORM,
    @Inject(AnyResponseVariantORM)
    protected readonly responseVariantORM: AnyResponseVariantORM,
    @Inject(LoguxService)
    protected readonly logux: LoguxService,
    @Inject(ResponseCardAttachmentService)
    protected readonly responseCardAttachment: ResponseCardAttachmentService,
    @Inject(ResponseMediaAttachmentService)
    protected readonly responseMediaAttachment: ResponseMediaAttachmentService
  ) {}

  /* Helpers */

  protected async syncResponseVariants(
    responseAttachments: AnyResponseAttachmentObject[],
    { action, userID, context }: { action: 'create' | 'delete'; userID: number; context: CMSContext }
  ): Promise<AnyResponseVariantObject[]> {
    const variantIDs = Utils.array.unique(
      responseAttachments.map((responseAttachment) => responseAttachment.variantID)
    );

    const responseVariants = await this.responseVariantORM.findManyByEnvironmentAndIDs(
      context.environmentID,
      variantIDs
    );

    if (variantIDs.length !== responseVariants.length) {
      throw new NotFoundException("couldn't find response variants to sync");
    }

    const responseAttachmentsByVariantIDMap = responseAttachments.reduce<Record<string, AnyResponseAttachmentObject[]>>(
      (acc, attachment) => {
        acc[attachment.variantID] ??= [];
        acc[attachment.variantID].push(attachment);

        return acc;
      },
      {}
    );

    await Promise.all(
      responseVariants.map(async (responseVariant) => {
        const attachmentIDs = toPostgresEntityIDs(responseAttachmentsByVariantIDMap[responseVariant.id] ?? []);

        if (!attachmentIDs.length) {
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

        await this.responseVariantORM.patchOneForUser(
          userID,
          { id: responseVariant.id, environmentID: responseVariant.environmentID },
          { attachmentOrder }
        );
      })
    );

    return responseVariants;
  }

  async broadcastSync({ sync }: { sync: { responseVariants: AnyResponseVariantObject[] } }, meta: CMSBroadcastMeta) {
    await Promise.all(
      sync.responseVariants.map((variant) =>
        this.logux.processAs(
          Actions.ResponseVariant.PatchOne({
            id: variant.id,
            patch: { attachmentOrder: variant.attachmentOrder },
            context: cmsBroadcastContext(meta.context),
          }),
          meta.auth
        )
      )
    );
  }

  /* Find */

  findManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.orm.findManyByEnvironmentAndIDs(environmentID, ids);
  }

  findOneOrFail(id: Primary<AnyResponseAttachmentEntity>, type?: AttachmentType) {
    return match(type)
      .with(AttachmentType.CARD, () => this.responseCardAttachment.findOneOrFail(id))
      .with(AttachmentType.MEDIA, () => this.responseMediaAttachment.findOneOrFail(id))
      .otherwise(() => this.orm.findOneOrFail(id));
  }

  findManyByVariants(environmentID: string, variantIDs: string[]) {
    return this.orm.findManyByVariants(environmentID, variantIDs);
  }

  findManyByEnvironment(environmentID: string) {
    return this.orm.findManyByEnvironment(environmentID);
  }

  findManyByAttachments(environmentID: string, attachmentIDs: string[]) {
    return this.orm.findManyByAttachments(environmentID, attachmentIDs);
  }

  /* Create */

  createOne(data: ResponseAnyAttachmentCreateData & { assistantID: string; environmentID: string }) {
    return this.orm.createOne(data);
  }

  createMany(data: Array<ResponseAnyAttachmentCreateData & { assistantID: string; environmentID: string }>) {
    return this.orm.createMany(data);
  }

  async createManyAndSync(
    data: ResponseAnyAttachmentCreateData[],
    { userID, context }: { userID: number; context: CMSContext }
  ) {
    return this.postgresEM.transactional(async () => {
      const responseAttachments = await this.createMany(data.map(injectAssistantAndEnvironmentIDs(context)));
      const responseVariants = await this.syncResponseVariants(responseAttachments, {
        action: 'create',
        userID,
        context,
      });

      return {
        add: { responseAttachments },
        sync: { responseVariants },
      };
    });
  }

  async broadcastAddMany(
    {
      add,
      sync,
    }: {
      add: { responseAttachments: AnyResponseAttachmentObject[] };
      sync: { responseVariants: AnyResponseVariantObject[] };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.logux.processAs(
        Actions.ResponseAttachment.AddMany({
          data: this.mapToJSON(add.responseAttachments),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),
      this.broadcastSync({ sync }, meta),
    ]);
  }

  async createManyAndBroadcast(data: ResponseAnyAttachmentCreateData[], meta: CMSBroadcastMeta) {
    const result = await this.createManyAndSync(data, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastAddMany(result, meta);

    return result.add.responseAttachments;
  }

  /* Replace */

  replaceOneAndSync(
    { type, variantID, newAttachmentID, oldResponseAttachmentID }: ResponseAnyAttachmentReplaceData,
    { userID, context }: { userID: number; context: CMSContext }
  ) {
    return this.postgresEM.transactional(async () => {
      const [responseVariant, oldResponseAttachment] = await Promise.all([
        this.responseVariantORM.findOneOrFail({ id: variantID, environmentID: context.environmentID }),
        this.findOneOrFail({ id: oldResponseAttachmentID, environmentID: context.environmentID }, type),
      ]);

      if (!responseVariant.attachmentOrder.includes(oldResponseAttachment.id)) {
        throw new NotFoundException('attachment not found in response variant');
      }

      const newResponseAttachment = await this.createOne(
        type === AttachmentType.CARD
          ? {
              type,
              cardID: newAttachmentID,
              variantID,
              assistantID: context.assistantID,
              environmentID: oldResponseAttachment.environmentID,
            }
          : {
              type,
              mediaID: newAttachmentID,
              variantID,
              assistantID: context.assistantID,
              environmentID: oldResponseAttachment.environmentID,
            }
      );

      await this.deleteOne({ id: oldResponseAttachment.id, environmentID: oldResponseAttachment.environmentID });

      responseVariant.attachmentOrder = responseVariant.attachmentOrder.map((id) =>
        id === oldResponseAttachment.id ? newResponseAttachment.id : id
      );

      await this.responseVariantORM.patchOne(
        { id: responseVariant.id, environmentID: responseVariant.environmentID },
        { updatedByID: userID, attachmentOrder: responseVariant.attachmentOrder }
      );

      return {
        add: { responseAttachment: newResponseAttachment },
        sync: { responseVariant },
        delete: { responseAttachment: oldResponseAttachment },
      };
    });
  }

  async broadcastReplaceOne(
    {
      add,
      sync,
      delete: del,
    }: {
      add: { responseAttachment: AnyResponseAttachmentObject };
      sync: { responseVariant: AnyResponseVariantObject };
      delete: { responseAttachment: AnyResponseAttachmentObject };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.logux.processAs(
        Actions.ResponseAttachment.AddOne({
          data: this.toJSON(add.responseAttachment),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),

      this.broadcastSync({ sync: { responseVariants: [sync.responseVariant] } }, meta),

      this.logux.processAs(
        Actions.ResponseAttachment.DeleteOne({
          id: del.responseAttachment.id,
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),
    ]);
  }

  async replaceOneAndBroadcast(
    { type, variantID, newAttachmentID, oldResponseAttachmentID }: ResponseAnyAttachmentReplaceData,
    meta: CMSBroadcastMeta
  ) {
    const result = await this.replaceOneAndSync(
      { type, variantID, newAttachmentID, oldResponseAttachmentID },
      { userID: meta.auth.userID, context: meta.context }
    );

    await this.broadcastReplaceOne(result, meta);
  }

  /* Delete */

  deleteOne(id: Primary<AnyResponseAttachmentEntity>) {
    return this.orm.deleteOne(id);
  }

  deleteManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.orm.deleteManyByEnvironmentAndIDs(environmentID, ids);
  }

  async syncOnDelete(
    attachments: AnyResponseAttachmentObject[],
    { userID, context }: { userID: number; context: CMSContext }
  ) {
    const responseVariants = await this.syncResponseVariants(attachments, { action: 'delete', userID, context });

    return { responseVariants };
  }

  async deleteManyAndSync(ids: string[], { userID, context }: { userID: number; context: CMSContext }) {
    return this.postgresEM.transactional(async () => {
      const responseAttachments = await this.findManyByEnvironmentAndIDs(context.environmentID, ids);

      const sync = await this.syncOnDelete(responseAttachments, { userID, context });

      await this.deleteManyByEnvironmentAndIDs(context.environmentID, ids);

      return {
        sync,
        delete: { responseAttachments },
      };
    });
  }

  async broadcastDeleteMany(
    {
      sync,
      delete: del,
    }: {
      sync: { responseVariants: AnyResponseVariantObject[] };
      delete: { responseAttachments: AnyResponseAttachmentObject[] };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.broadcastSync({ sync }, meta),

      this.logux.processAs(
        Actions.ResponseAttachment.DeleteMany({
          ids: toPostgresEntityIDs(del.responseAttachments),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),
    ]);
  }

  async deleteManyAndBroadcast(ids: string[], meta: CMSBroadcastMeta) {
    const result = await this.deleteManyAndSync(ids, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastDeleteMany(result, meta);
  }

  /* Upsert */

  upsertMany(data: CreateData<AnyResponseAttachmentEntity>[]) {
    return this.orm.upsertMany(data);
  }
}

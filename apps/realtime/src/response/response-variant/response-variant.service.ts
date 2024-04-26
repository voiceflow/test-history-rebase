/* eslint-disable max-params */
import type { EntityManager } from '@mikro-orm/core';
import { Primary } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import type { AnyResponseVariant } from '@voiceflow/dtos';
import { ResponseVariantType } from '@voiceflow/dtos';
import { NotFoundException } from '@voiceflow/exception';
import { LoguxService } from '@voiceflow/nestjs-logux';
import type {
  AnyResponseAttachmentEntity,
  AnyResponseAttachmentObject,
  AnyResponseVariantEntity,
  AnyResponseVariantObject,
  CreateData,
  ResponseDiscriminatorObject,
} from '@voiceflow/orm-designer';
import {
  AnyResponseVariantORM,
  DatabaseTarget,
  ObjectId,
  PromptORM,
  ResponseDiscriminatorORM,
} from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { match } from 'ts-pattern';

import { cmsBroadcastContext, toPostgresEntityIDs } from '@/common/utils';
import { CMSBroadcastMeta, CMSContext } from '@/types';

import { ResponseAttachmentService } from '../response-attachment/response-attachment.service';
import { ResponseJSONVariantService } from './response-json-variant.service';
import { ResponseTextVariantService } from './response-text-variant.service';
import type {
  ResponseAnyVariantCreateData,
  ResponseAnyVariantCreateWithSubResourcesData,
  ResponseAnyVariantPatchData,
} from './response-variant.interface';
import { emptyResponseVariantFactory } from './response-variant.util';

@Injectable()
export class ResponseVariantService {
  toJSON = (data: AnyResponseVariantObject) =>
    match(data)
      .with({ type: ResponseVariantType.JSON }, this.responseJSONVariant.toJSON)
      .with({ type: ResponseVariantType.TEXT }, this.responseTextVariant.toJSON)
      .exhaustive();

  fromJSON = (data: AnyResponseVariant) =>
    match(data)
      .with({ type: ResponseVariantType.JSON }, this.responseJSONVariant.fromJSON)
      .with({ type: ResponseVariantType.TEXT }, this.responseTextVariant.fromJSON)
      .exhaustive();

  mapToJSON = (data: AnyResponseVariantObject[]) => data.map(this.toJSON);

  mapFromJSON = (data: AnyResponseVariant[]) => data.map(this.fromJSON);

  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(AnyResponseVariantORM)
    protected readonly orm: AnyResponseVariantORM,
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
    protected readonly responseTextVariant: ResponseTextVariantService
  ) {}

  /* Helpers */

  protected async syncDiscriminators(
    variants: AnyResponseVariantObject[],
    {
      action,
      userID,
      context,
      discriminatorOrderInsertIndex = 1,
    }: { action: 'create' | 'delete'; userID: number; context: CMSContext; discriminatorOrderInsertIndex?: number }
  ) {
    const responseDiscriminatorIDs = Utils.array.unique(variants.map((variant) => variant.discriminatorID));

    const responseDiscriminators = await this.responseDiscriminatorORM.findManyByEnvironmentAndIDs(
      context.environmentID,
      responseDiscriminatorIDs
    );

    if (responseDiscriminatorIDs.length !== responseDiscriminators.length) {
      throw new NotFoundException("couldn't find response discriminator to sync");
    }

    const responseVariantsByResponseDiscriminatorIDMap = variants.reduce<Record<string, typeof variants>>(
      (acc, variant) => {
        acc[variant.discriminatorID] ??= [];
        acc[variant.discriminatorID].push(variant);

        return acc;
      },
      {}
    );

    await Promise.all(
      responseDiscriminators.map(async (discriminator) => {
        const variantIDs = toPostgresEntityIDs(responseVariantsByResponseDiscriminatorIDMap[discriminator.id] ?? []);

        if (!variantIDs.length) {
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
        discriminator.variantOrder = variantOrder;

        await this.responseDiscriminatorORM.patchOneForUser(
          userID,
          { id: discriminator.id, environmentID: discriminator.environmentID },
          { variantOrder }
        );
      })
    );

    return responseDiscriminators;
  }

  async broadcastSync(
    { sync }: { sync: { responseDiscriminators: ResponseDiscriminatorObject[] } },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all(
      sync.responseDiscriminators.map((discriminator) =>
        this.logux.processAs(
          Actions.ResponseDiscriminator.PatchOne({
            id: discriminator.id,
            patch: { variantOrder: discriminator.variantOrder },
            context: cmsBroadcastContext(meta.context),
          }),
          meta.auth
        )
      )
    );
  }

  /* Find */

  findOneOrFail(id: Primary<AnyResponseAttachmentEntity>): Promise<AnyResponseVariantObject> {
    return this.orm.findOneOrFail(id);
  }

  findManyByEnvironment(environmentID: string) {
    return this.orm.findManyByEnvironment(environmentID);
  }

  findManyByDiscriminators(environmentID: string, discriminatorIDs: string[]) {
    return this.orm.findManyByDiscriminators(environmentID, discriminatorIDs);
  }

  findManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.orm.findManyByEnvironmentAndIDs(environmentID, ids);
  }

  /* Create */

  createOne(
    data: ResponseAnyVariantCreateData & { updatedByID: number | null; assistantID: string; environmentID: string }
  ) {
    return this.orm.createOne(data);
  }

  createMany(
    data: Array<
      ResponseAnyVariantCreateData & { updatedByID: number | null; assistantID: string; environmentID: string }
    >
  ) {
    return this.orm.createMany(data);
  }

  createOneForUser(
    userID: number,
    data: ResponseAnyVariantCreateData & { assistantID: string; environmentID: string }
  ) {
    return this.orm.createOneForUser(userID, data);
  }

  createManyForUser(
    userID: number,
    data: Array<ResponseAnyVariantCreateData & { assistantID: string; environmentID: string }>
  ) {
    return this.orm.createManyForUser(userID, data);
  }

  async createManyWithSubResources(
    data: ResponseAnyVariantCreateWithSubResourcesData[],
    { userID, context }: { userID: number; context: CMSContext }
  ) {
    const dataWithIDs = data.map((data) => {
      const variantID = data.id ?? new ObjectId().toJSON();

      const attachmentsWithIDs = data.attachments.map((attachment) => ({
        ...attachment,
        id: attachment.id ?? new ObjectId().toJSON(),
        variantID,
        assistantID: context.assistantID,
        environmentID: context.environmentID,
      }));

      return {
        ...data,
        id: variantID,
        attachments: attachmentsWithIDs,
        assistantID: context.assistantID,
        environmentID: context.environmentID,
        attachmentOrder: attachmentsWithIDs.map((attachment) => attachment.id),
      };
    });

    const responseVariants = await this.createManyForUser(
      userID,
      dataWithIDs.map(({ condition: _, attachments: __, ...data }) => data)
    );

    const responseAttachments = await this.responseAttachment.createMany(
      dataWithIDs.flatMap(({ attachments }) => attachments)
    );

    return {
      responseVariants,
      responseAttachments,
    };
  }

  async createManyAndSync(
    data: ResponseAnyVariantCreateWithSubResourcesData[],
    {
      userID,
      context,
      discriminatorOrderInsertIndex,
    }: { userID: number; context: CMSContext; discriminatorOrderInsertIndex?: number }
  ) {
    return this.postgresEM.transactional(async () => {
      const { responseVariants, responseAttachments } = await this.createManyWithSubResources(data, {
        userID,
        context,
      });

      const responseDiscriminators = await this.syncDiscriminators(responseVariants, {
        action: 'create',
        userID,
        context,
        discriminatorOrderInsertIndex,
      });

      return {
        add: { responseVariants, responseAttachments },
        sync: { responseDiscriminators },
      };
    });
  }

  async broadcastAddMany(
    {
      add,
      sync,
    }: {
      add: { responseVariants: AnyResponseVariantObject[]; responseAttachments: AnyResponseAttachmentObject[] };
      sync: { responseDiscriminators: ResponseDiscriminatorObject[] };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.responseAttachment.broadcastAddMany(
        {
          add: Utils.object.pick(add, ['responseAttachments']),
          // no need to sync attachments, should be synced on create
          sync: { responseVariants: [] },
        },
        meta
      ),

      this.logux.processAs(
        Actions.ResponseVariant.AddMany({
          data: this.mapToJSON(add.responseVariants),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),

      this.broadcastSync({ sync }, meta),
    ]);
  }

  async createManyAndBroadcast(
    data: ResponseAnyVariantCreateWithSubResourcesData[],
    { auth, context, discriminatorOrderInsertIndex }: CMSBroadcastMeta & { discriminatorOrderInsertIndex?: number }
  ) {
    const result = await this.createManyAndSync(data, { userID: auth.userID, context, discriminatorOrderInsertIndex });

    await this.broadcastAddMany(result, { auth, context });

    return result.add.responseVariants;
  }

  /* Upsert */

  upsertMany(data: CreateData<AnyResponseVariantEntity>[]) {
    return this.orm.upsertMany(data);
  }

  /* Update */

  patchMany(ids: Primary<AnyResponseVariantEntity>[], patch: ResponseAnyVariantPatchData) {
    return match(patch)
      .with({ type: ResponseVariantType.JSON }, (data) => this.responseJSONVariant.patchMany(ids, data))
      .with({ type: ResponseVariantType.TEXT }, (data) => this.responseTextVariant.patchMany(ids, data))
      .exhaustive();
  }

  async replaceOneWithTypeAndSync(
    { id, type }: { id: string; type: ResponseVariantType },
    { userID, context }: { userID: number; context: CMSContext }
  ) {
    return this.postgresEM.transactional(async () => {
      const responseVariant = await this.findOneOrFail({ id, environmentID: context.environmentID });

      const [newResponseVariant, responseDiscriminator, relationsToDelete] = await Promise.all([
        this.createOneForUser(userID, {
          ...emptyResponseVariantFactory({ type, discriminatorID: responseVariant.discriminatorID }),
          assistantID: context.assistantID,
          environmentID: context.environmentID,
        }),
        this.responseDiscriminatorORM.findOneOrFail({
          id: responseVariant.discriminatorID,
          environmentID: responseVariant.environmentID,
        }),
        this.collectRelationsToDelete(context.environmentID, [responseVariant.id]),
      ]);

      await this.deleteManyByEnvironmentAndIDs(context.environmentID, [id]);

      responseDiscriminator.variantOrder = responseDiscriminator.variantOrder.map((variantID) =>
        variantID === id ? newResponseVariant.id : variantID
      );

      await this.responseDiscriminatorORM.patchOne(
        { id: responseDiscriminator.id, environmentID: responseDiscriminator.environmentID },
        { updatedByID: userID, variantOrder: responseDiscriminator.variantOrder }
      );

      return {
        add: { responseVariants: [newResponseVariant] },
        sync: { responseDiscriminators: [responseDiscriminator] },
        delete: { ...relationsToDelete, responseVariants: [responseVariant] },
      };
    });
  }

  async broadcastReplaceOneWithType(
    {
      add,
      sync,
      delete: del,
    }: {
      add: { responseVariants: AnyResponseVariantObject[] };
      sync: { responseDiscriminators: ResponseDiscriminatorObject[] };
      delete: { responseVariants: AnyResponseVariantObject[]; responseAttachments: AnyResponseAttachmentObject[] };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      // no need to sync discriminators on delete, should be synced on create
      this.broadcastDeleteMany({ delete: del, sync: { responseDiscriminators: [] } }, meta),
      this.broadcastAddMany({ add: { ...add, responseAttachments: [] }, sync }, meta),
    ]);
  }

  async replaceOneWithTypeAndBroadcast(
    { id, type }: { id: string; type: ResponseVariantType },
    meta: CMSBroadcastMeta
  ) {
    const result = await this.replaceOneWithTypeAndSync(
      { id, type },
      { userID: meta.auth.userID, context: meta.context }
    );

    await this.broadcastReplaceOneWithType(result, meta);
  }

  /* Delete */

  deleteManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.orm.deleteManyByEnvironmentAndIDs(environmentID, ids);
  }

  async collectRelationsToDelete(environmentID: string, variantIDs: string[]) {
    const responseAttachments = await this.responseAttachment.findManyByVariants(environmentID, variantIDs);

    return {
      responseAttachments,
    };
  }

  async syncOnDelete(
    variants: AnyResponseVariantObject[],
    { userID, context }: { userID: number; context: CMSContext }
  ) {
    const responseDiscriminators = await this.syncDiscriminators(variants, { action: 'delete', userID, context });

    return { responseDiscriminators };
  }

  async deleteManyAndSync(ids: string[], { userID, context }: { userID: number; context: CMSContext }) {
    return this.postgresEM.transactional(async () => {
      const [responseVariants, relations] = await Promise.all([
        this.findManyByEnvironmentAndIDs(context.environmentID, ids),
        this.collectRelationsToDelete(context.environmentID, ids),
      ]);

      const sync = await this.syncOnDelete(responseVariants, { userID, context });

      await this.deleteManyByEnvironmentAndIDs(context.environmentID, ids);

      return {
        sync,
        delete: { ...relations, responseVariants },
      };
    });
  }

  async broadcastDeleteMany(
    {
      sync,
      delete: del,
    }: {
      sync: { responseDiscriminators: ResponseDiscriminatorObject[] };
      delete: { responseVariants: AnyResponseVariantObject[]; responseAttachments: AnyResponseAttachmentObject[] };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.broadcastSync({ sync }, meta),

      this.logux.processAs(
        Actions.ResponseVariant.DeleteMany({
          ids: toPostgresEntityIDs(del.responseVariants),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),

      this.responseAttachment.broadcastDeleteMany(
        {
          delete: Utils.object.pick(del, ['responseAttachments']),
          // no need to sync attachments, variants are removed
          sync: { responseVariants: [] },
        },
        meta
      ),
    ]);
  }

  async deleteManyAndBroadcast(ids: string[], meta: CMSBroadcastMeta) {
    const result = await this.deleteManyAndSync(ids, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastDeleteMany(result, meta);
  }
}

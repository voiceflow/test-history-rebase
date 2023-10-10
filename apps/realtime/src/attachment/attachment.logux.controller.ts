import { type MikroORM, UseRequestContext } from '@mikro-orm/core';
import { getMikroORMToken } from '@mikro-orm/nestjs';
import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import type { CardAttachmentEntity, MediaAttachmentEntity } from '@voiceflow/orm-designer';
import { AttachmentType, DatabaseTarget } from '@voiceflow/orm-designer';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, EntitySerializer } from '@/common';

import { AttachmentService } from './attachment.service';
import { CardAttachmentService } from './card-attachment.service';
import { MediaAttachmentService } from './media-attachment.service';

@Controller()
export class AttachmentLoguxController {
  constructor(
    @Inject(getMikroORMToken(DatabaseTarget.POSTGRES))
    private readonly orm: MikroORM,
    @Inject(AttachmentService)
    private readonly service: AttachmentService,
    @Inject(CardAttachmentService)
    private readonly cardAttachment: CardAttachmentService,
    @Inject(MediaAttachmentService)
    private readonly mediaAttachment: MediaAttachmentService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {}

  @Action.Async(Actions.Attachment.CreateCardOne)
  @Authorize.Permissions<Actions.Attachment.CreateCardOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  createCardOne(
    @Payload() { data, context }: Actions.Attachment.CreateCardOne.Request,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Actions.Attachment.CreateCardOne.Response> {
    return this.service
      .createManyAndBroadcast(authMeta, [
        { ...data, type: AttachmentType.CARD, assistantID: context.assistantID, environmentID: context.environmentID },
      ])
      .then(([result]) => ({ data: this.entitySerializer.serialize(result as CardAttachmentEntity), context }));
  }

  @Action.Async(Actions.Attachment.CreateMediaOne)
  @Authorize.Permissions<Actions.Attachment.CreateMediaOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  createMediaOne(
    @Payload() { data, context }: Actions.Attachment.CreateMediaOne.Request,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Actions.Attachment.CreateMediaOne.Response> {
    return this.service
      .createManyAndBroadcast(authMeta, [
        { ...data, type: AttachmentType.MEDIA, assistantID: context.assistantID, environmentID: context.environmentID },
      ])
      .then(([result]) => ({ data: this.entitySerializer.serialize(result as MediaAttachmentEntity), context }));
  }

  @Action(Actions.Attachment.PatchOneCard)
  @Authorize.Permissions<Actions.Attachment.PatchOneCard>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Attachment.PatchOneCard>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOneCard(@Payload() { id, patch, context }: Actions.Attachment.PatchOneCard) {
    await this.cardAttachment.patchOne({ id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.Attachment.PatchOneMedia)
  @Authorize.Permissions<Actions.Attachment.PatchOneMedia>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Attachment.PatchOneMedia>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOneMedia(@Payload() { id, patch, context }: Actions.Attachment.PatchOneMedia) {
    await this.mediaAttachment.patchOne({ id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.Attachment.PatchManyCard)
  @Authorize.Permissions<Actions.Attachment.PatchManyCard>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Attachment.PatchManyCard>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchManyCard(@Payload() { ids, patch, context }: Actions.Attachment.PatchManyCard) {
    await this.cardAttachment.patchMany(
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.Attachment.PatchManyMedia)
  @Authorize.Permissions<Actions.Attachment.PatchManyMedia>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Attachment.PatchManyMedia>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchManyMedia(@Payload() { ids, patch, context }: Actions.Attachment.PatchManyMedia) {
    await this.mediaAttachment.patchMany(
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.Attachment.DeleteOne)
  @Authorize.Permissions<Actions.Attachment.DeleteOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Attachment.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.Attachment.DeleteOne, @AuthMeta() authMeta: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync([{ id, environmentID: context.environmentID }]);

    // overriding attachments cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(authMeta, { ...result, delete: { ...result.delete, attachments: [] } });
  }

  @Action(Actions.Attachment.DeleteMany)
  @Authorize.Permissions<Actions.Attachment.DeleteMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Attachment.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.Attachment.DeleteMany, @AuthMeta() authMeta: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync(ids.map((id) => ({ id, environmentID: context.environmentID })));

    // overriding attachments cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(authMeta, { ...result, delete: { ...result.delete, attachments: [] } });
  }

  @Action(Actions.Attachment.AddOne)
  @Authorize.Permissions<Actions.Attachment.AddOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Attachment.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.Attachment.AddOne) {
    // for broadcast only
  }

  @Action(Actions.Attachment.AddMany)
  @Authorize.Permissions<Actions.Attachment.AddMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Attachment.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.Attachment.AddMany) {
    // for broadcast only
  }
}

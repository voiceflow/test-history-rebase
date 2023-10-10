import type { MikroORM } from '@mikro-orm/core';
import { UseRequestContext } from '@mikro-orm/core';
import { getMikroORMToken } from '@mikro-orm/nestjs';
import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import type { ResponseCardAttachmentEntity, ResponseMediaAttachmentEntity } from '@voiceflow/orm-designer';
import { AttachmentType, DatabaseTarget } from '@voiceflow/orm-designer';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, EntitySerializer } from '@/common';

import { ResponseAttachmentService } from './response-attachment.service';

@Controller()
export class ResponseAttachmentLoguxController {
  constructor(
    @Inject(getMikroORMToken(DatabaseTarget.POSTGRES))
    private readonly orm: MikroORM,
    @Inject(ResponseAttachmentService)
    private readonly service: ResponseAttachmentService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {}

  @Action.Async(Actions.ResponseAttachment.CreateCardOne)
  @Authorize.Permissions<Actions.ResponseAttachment.CreateCardOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  async createCardOne(
    @Payload() { data, context }: Actions.ResponseAttachment.CreateCardOne.Request,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Actions.ResponseAttachment.CreateCardOne.Response> {
    return this.service
      .createManyAndBroadcast(authMeta, [
        { ...data, type: AttachmentType.CARD, assistantID: context.assistantID, environmentID: context.environmentID },
      ])
      .then(([attachment]) => ({
        data: this.entitySerializer.nullable(attachment as ResponseCardAttachmentEntity),
        context,
      }));
  }

  @Action.Async(Actions.ResponseAttachment.CreateMediaOne)
  @Authorize.Permissions<Actions.ResponseAttachment.CreateMediaOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  async createMediaOne(
    @Payload() { data, context }: Actions.ResponseAttachment.CreateMediaOne.Request,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Actions.ResponseAttachment.CreateMediaOne.Response> {
    return this.service
      .createManyAndBroadcast(authMeta, [
        { ...data, type: AttachmentType.MEDIA, assistantID: context.assistantID, environmentID: context.environmentID },
      ])
      .then(([attachment]) => ({
        data: this.entitySerializer.nullable(attachment as ResponseMediaAttachmentEntity),
        context,
      }));
  }

  @Action(Actions.ResponseAttachment.ReplaceOneCard)
  @Authorize.Permissions<Actions.ResponseAttachment.ReplaceOneCard>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  async replaceOneCard(
    @Payload() { oldCardID, variantID, attachmentID, context }: Actions.ResponseAttachment.ReplaceOneCard,
    @AuthMeta() authMeta: AuthMetaPayload
  ) {
    await this.service.replaceOneAndBroadcast(authMeta, {
      type: AttachmentType.CARD,
      variantID,
      environmentID: context.environmentID,
      newAttachmentID: attachmentID,
      oldResponseAttachmentID: oldCardID,
    });
  }

  @Action(Actions.ResponseAttachment.ReplaceOneMedia)
  @Authorize.Permissions<Actions.ResponseAttachment.ReplaceOneMedia>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  async replaceOneMedia(
    @Payload() { oldMediaID, variantID, attachmentID, context }: Actions.ResponseAttachment.ReplaceOneMedia,
    @AuthMeta() authMeta: AuthMetaPayload
  ) {
    await this.service.replaceOneAndBroadcast(authMeta, {
      type: AttachmentType.MEDIA,
      variantID,
      environmentID: context.environmentID,
      newAttachmentID: attachmentID,
      oldResponseAttachmentID: oldMediaID,
    });
  }

  @Action(Actions.ResponseAttachment.DeleteOne)
  @Authorize.Permissions<Actions.ResponseAttachment.DeleteOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseAttachment.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.ResponseAttachment.DeleteOne, @AuthMeta() authMeta: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync([{ id, environmentID: context.environmentID }]);

    // overriding variants cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(authMeta, { ...result, delete: { ...result.delete, responseAttachments: [] } });
  }

  @Action(Actions.ResponseAttachment.DeleteMany)
  @Authorize.Permissions<Actions.ResponseAttachment.DeleteMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseAttachment.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.ResponseAttachment.DeleteMany, @AuthMeta() authMeta: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync(ids.map((id) => ({ id, environmentID: context.environmentID })));

    // overriding variants cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(authMeta, { ...result, delete: { ...result.delete, responseAttachments: [] } });
  }

  @Action(Actions.ResponseAttachment.AddOne)
  @Authorize.Permissions<Actions.ResponseAttachment.AddOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseAttachment.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.ResponseAttachment.AddOne) {
    // broadcast only
  }

  @Action(Actions.ResponseAttachment.AddMany)
  @Authorize.Permissions<Actions.ResponseAttachment.AddMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseAttachment.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.ResponseAttachment.AddMany) {
    // broadcast only
  }
}

import { Controller, Inject } from '@nestjs/common';
import { AttachmentType, CardAttachment, MediaAttachment } from '@voiceflow/dtos';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext, UseRequestContext } from '@/common';

import { AttachmentService } from './attachment.service';
import { CardAttachmentService } from './card-attachment.service';
import { MediaAttachmentService } from './media-attachment.service';

@Controller()
@InjectRequestContext()
export class AttachmentLoguxController {
  constructor(
    @Inject(AttachmentService)
    private readonly service: AttachmentService,
    @Inject(CardAttachmentService)
    private readonly cardAttachment: CardAttachmentService,
    @Inject(MediaAttachmentService)
    private readonly mediaAttachment: MediaAttachmentService
  ) {}

  @Action.Async(Actions.Attachment.CreateCardOne)
  @Authorize.Permissions<Actions.Attachment.CreateCardOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  createCardOne(
    @Payload() { data, context }: Actions.Attachment.CreateCardOne.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.Attachment.CreateCardOne.Response> {
    return this.service
      .createManyAndBroadcast([{ ...data, type: AttachmentType.CARD }], { auth, context })
      .then(([result]) => ({ data: this.service.toJSON(result) as CardAttachment, context }));
  }

  @Action.Async(Actions.Attachment.CreateMediaOne)
  @Authorize.Permissions<Actions.Attachment.CreateMediaOne.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  createMediaOne(
    @Payload() { data, context }: Actions.Attachment.CreateMediaOne.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.Attachment.CreateMediaOne.Response> {
    return this.service
      .createManyAndBroadcast([{ ...data, type: AttachmentType.MEDIA }], { auth, context })
      .then(([result]) => ({ data: this.service.toJSON(result) as MediaAttachment, context }));
  }

  @Action(Actions.Attachment.PatchOneCard)
  @Authorize.Permissions<Actions.Attachment.PatchOneCard>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Attachment.PatchOneCard>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOneCard(@Payload() { id, patch, context }: Actions.Attachment.PatchOneCard, @AuthMeta() auth: AuthMetaPayload) {
    await this.cardAttachment.patchOneForUser(auth.userID, { id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.Attachment.PatchOneMedia)
  @Authorize.Permissions<Actions.Attachment.PatchOneMedia>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Attachment.PatchOneMedia>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOneMedia(@Payload() { id, patch, context }: Actions.Attachment.PatchOneMedia, @AuthMeta() auth: AuthMetaPayload) {
    await this.mediaAttachment.patchOneForUser(auth.userID, { id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.Attachment.PatchManyCard)
  @Authorize.Permissions<Actions.Attachment.PatchManyCard>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Attachment.PatchManyCard>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchManyCard(@Payload() { ids, patch, context }: Actions.Attachment.PatchManyCard, @AuthMeta() auth: AuthMetaPayload) {
    await this.cardAttachment.patchManyForUser(
      auth.userID,
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
  async patchManyMedia(@Payload() { ids, patch, context }: Actions.Attachment.PatchManyMedia, @AuthMeta() auth: AuthMetaPayload) {
    await this.mediaAttachment.patchManyForUser(
      auth.userID,
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
  async deleteOne(@Payload() { id, context }: Actions.Attachment.DeleteOne, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync([id], { userID: auth.userID, context });

    // overriding attachments cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, attachments: [] } }, { auth, context });
  }

  @Action(Actions.Attachment.DeleteMany)
  @Authorize.Permissions<Actions.Attachment.DeleteMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Attachment.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.Attachment.DeleteMany, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync(ids, { userID: auth.userID, context });

    // overriding attachments cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, attachments: [] } }, { auth, context });
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

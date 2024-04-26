import { Controller, Inject } from '@nestjs/common';
import { AttachmentType, ResponseCardAttachment, ResponseMediaAttachment } from '@voiceflow/dtos';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext, UseRequestContext } from '@/common';

import { ResponseAttachmentService } from './response-attachment.service';

@Controller()
@InjectRequestContext()
export class ResponseAttachmentLoguxController {
  constructor(
    @Inject(ResponseAttachmentService)
    private readonly service: ResponseAttachmentService
  ) {}

  @Action.Async(Actions.ResponseAttachment.CreateCardOne)
  @Authorize.Permissions<Actions.ResponseAttachment.CreateCardOne.Request>(
    [Permission.PROJECT_UPDATE],
    ({ context }) => ({
      id: context.environmentID,
      kind: 'version',
    })
  )
  @UseRequestContext()
  async createCardOne(
    @Payload() { data, context }: Actions.ResponseAttachment.CreateCardOne.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.ResponseAttachment.CreateCardOne.Response> {
    return this.service
      .createManyAndBroadcast([{ ...data, type: AttachmentType.CARD }], { auth, context })
      .then(([result]) => ({
        data: this.service.toJSON(result) as ResponseCardAttachment,
        context,
      }));
  }

  @Action.Async(Actions.ResponseAttachment.CreateMediaOne)
  @Authorize.Permissions<Actions.ResponseAttachment.CreateMediaOne.Request>(
    [Permission.PROJECT_UPDATE],
    ({ context }) => ({
      id: context.environmentID,
      kind: 'version',
    })
  )
  @UseRequestContext()
  async createMediaOne(
    @Payload() { data, context }: Actions.ResponseAttachment.CreateMediaOne.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.ResponseAttachment.CreateMediaOne.Response> {
    return this.service
      .createManyAndBroadcast([{ ...data, type: AttachmentType.MEDIA }], { auth, context })
      .then(([result]) => ({
        data: this.service.toJSON(result) as ResponseMediaAttachment,
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
    @AuthMeta() auth: AuthMetaPayload
  ) {
    await this.service.replaceOneAndBroadcast(
      { type: AttachmentType.CARD, variantID, newAttachmentID: attachmentID, oldResponseAttachmentID: oldCardID },
      { auth, context }
    );
  }

  @Action(Actions.ResponseAttachment.ReplaceOneMedia)
  @Authorize.Permissions<Actions.ResponseAttachment.ReplaceOneMedia>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  async replaceOneMedia(
    @Payload() { oldMediaID, variantID, attachmentID, context }: Actions.ResponseAttachment.ReplaceOneMedia,
    @AuthMeta() auth: AuthMetaPayload
  ) {
    await this.service.replaceOneAndBroadcast(
      { type: AttachmentType.MEDIA, variantID, newAttachmentID: attachmentID, oldResponseAttachmentID: oldMediaID },
      { auth, context }
    );
  }

  @Action(Actions.ResponseAttachment.DeleteOne)
  @Authorize.Permissions<Actions.ResponseAttachment.DeleteOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseAttachment.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.ResponseAttachment.DeleteOne, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync([id], { userID: auth.userID, context });

    // overriding variants cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(
      { ...result, delete: { ...result.delete, responseAttachments: [] } },
      { auth, context }
    );
  }

  @Action(Actions.ResponseAttachment.DeleteMany)
  @Authorize.Permissions<Actions.ResponseAttachment.DeleteMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.ResponseAttachment.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(
    @Payload() { ids, context }: Actions.ResponseAttachment.DeleteMany,
    @AuthMeta() auth: AuthMetaPayload
  ) {
    const result = await this.service.deleteManyAndSync(ids, { userID: auth.userID, context });

    // overriding variants cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany(
      { ...result, delete: { ...result.delete, responseAttachments: [] } },
      { auth, context }
    );
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

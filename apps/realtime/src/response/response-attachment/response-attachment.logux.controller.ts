import type { MikroORM } from '@mikro-orm/core';
import { UseRequestContext } from '@mikro-orm/core';
import { getMikroORMToken } from '@mikro-orm/nestjs';
import { Controller, Inject } from '@nestjs/common';
import { Action, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import type { ResponseCardAttachmentEntity, ResponseMediaAttachmentEntity } from '@voiceflow/orm-designer';
import { AttachmentType, DatabaseTarget } from '@voiceflow/orm-designer';
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
  @UseRequestContext()
  async createCardOne(
    @Payload() { data, context }: Actions.ResponseAttachment.CreateCardOne.Request
  ): Promise<Actions.ResponseAttachment.CreateCardOne.Response> {
    return this.service
      .createManyAndBroadcast([{ ...data, type: AttachmentType.CARD, assistantID: context.assistantID, environmentID: context.environmentID }])
      .then(([attachment]) => ({
        data: this.entitySerializer.nullable(attachment as ResponseCardAttachmentEntity),
        context,
      }));
  }

  @Action.Async(Actions.ResponseAttachment.CreateMediaOne)
  @UseRequestContext()
  async createMediaOne(
    @Payload() { data, context }: Actions.ResponseAttachment.CreateMediaOne.Request
  ): Promise<Actions.ResponseAttachment.CreateMediaOne.Response> {
    return this.service
      .createManyAndBroadcast([{ ...data, type: AttachmentType.MEDIA, assistantID: context.assistantID, environmentID: context.environmentID }])
      .then(([attachment]) => ({
        data: this.entitySerializer.nullable(attachment as ResponseMediaAttachmentEntity),
        context,
      }));
  }

  @Action(Actions.ResponseAttachment.ReplaceOneCard)
  @UseRequestContext()
  async replaceOneCard(@Payload() { oldCardID, variantID, attachmentID, context }: Actions.ResponseAttachment.ReplaceOneCard) {
    await this.service.replaceOneAndBroadcast({
      type: AttachmentType.CARD,
      variantID,
      environmentID: context.environmentID,
      newAttachmentID: attachmentID,
      oldResponseAttachmentID: oldCardID,
    });
  }

  @Action(Actions.ResponseAttachment.ReplaceOneMedia)
  @UseRequestContext()
  async replaceOneMedia(@Payload() { oldMediaID, variantID, attachmentID, context }: Actions.ResponseAttachment.ReplaceOneMedia) {
    await this.service.replaceOneAndBroadcast({
      type: AttachmentType.MEDIA,
      variantID,
      environmentID: context.environmentID,
      newAttachmentID: attachmentID,
      oldResponseAttachmentID: oldMediaID,
    });
  }

  @Action(Actions.ResponseAttachment.DeleteOne)
  @Broadcast<Actions.ResponseAttachment.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.ResponseAttachment.DeleteOne) {
    const result = await this.service.deleteManyAndSync([{ id, environmentID: context.environmentID }]);

    // overriding variants cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, responseAttachments: [] } });
  }

  @Action(Actions.ResponseAttachment.DeleteMany)
  @Broadcast<Actions.ResponseAttachment.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.ResponseAttachment.DeleteMany) {
    const result = await this.service.deleteManyAndSync(ids.map((id) => ({ id, environmentID: context.environmentID })));

    // overriding variants cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, responseAttachments: [] } });
  }

  @Action(Actions.ResponseAttachment.AddOne)
  @Broadcast<Actions.ResponseAttachment.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.ResponseAttachment.AddOne) {
    // broadcast only
  }

  @Action(Actions.ResponseAttachment.AddMany)
  @Broadcast<Actions.ResponseAttachment.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.ResponseAttachment.AddMany) {
    // broadcast only
  }
}

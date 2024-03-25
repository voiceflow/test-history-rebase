import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext, UseRequestContext } from '@/common';

import { CardButtonService } from './card-button.service';

@Controller()
@InjectRequestContext()
export class CardButtonLoguxController {
  constructor(
    @Inject(CardButtonService)
    private readonly service: CardButtonService
  ) {}

  @Action.Async(Actions.CardButton.Create)
  @Authorize.Permissions<Actions.CardButton.Create.Request>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @UseRequestContext()
  createOne(
    @Payload() { data, context }: Actions.CardButton.Create.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.CardButton.Create.Response> {
    return this.service.createManyAndBroadcast([data], { auth, context }).then(([result]) => ({ data: this.service.toJSON(result), context }));
  }

  @Action(Actions.CardButton.PatchOne)
  @Authorize.Permissions<Actions.CardButton.PatchOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.CardButton.PatchOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchOne(@Payload() { id, patch, context }: Actions.CardButton.PatchOne, @AuthMeta() auth: AuthMetaPayload) {
    await this.service.patchOneForUser(auth.userID, { id, environmentID: context.environmentID }, patch);
  }

  @Action(Actions.CardButton.PatchMany)
  @Authorize.Permissions<Actions.CardButton.PatchMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.CardButton.PatchMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async patchMany(@Payload() { ids, patch, context }: Actions.CardButton.PatchMany, @AuthMeta() auth: AuthMetaPayload) {
    await this.service.patchManyForUser(
      auth.userID,
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action(Actions.CardButton.DeleteOne)
  @Authorize.Permissions<Actions.CardButton.DeleteOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.CardButton.DeleteOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteOne(@Payload() { id, context }: Actions.CardButton.DeleteOne, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync([id], { userID: auth.userID, context });

    // overriding cardButtons cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, cardButtons: [] } }, { auth, context });
  }

  @Action(Actions.CardButton.DeleteMany)
  @Authorize.Permissions<Actions.CardButton.DeleteMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.CardButton.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async deleteMany(@Payload() { ids, context }: Actions.CardButton.DeleteMany, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync(ids, { userID: auth.userID, context });

    // overriding cardButtons cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, cardButtons: [] } }, { auth, context });
  }

  @Action(Actions.CardButton.AddOne)
  @Authorize.Permissions<Actions.CardButton.AddOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.CardButton.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.CardButton.AddOne) {
    // for broadcast only
  }

  @Action(Actions.CardButton.AddMany)
  @Authorize.Permissions<Actions.CardButton.AddMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.CardButton.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.CardButton.AddMany) {
    // for broadcast only
  }
}

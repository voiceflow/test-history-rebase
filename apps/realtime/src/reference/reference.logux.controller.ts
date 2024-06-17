import { Controller } from '@nestjs/common';
import { Action, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext } from '@/common';

@Controller()
@InjectRequestContext()
export class ReferenceLoguxController {
  constructor() {}

  @Action(Actions.Reference.AddMany)
  @Authorize.Permissions<Actions.Reference.AddMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Reference.AddMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addMany(@Payload() _: Actions.Reference.AddMany) {
    // broadcast only
  }

  @Action(Actions.Reference.DeleteMany)
  @Authorize.Permissions<Actions.Reference.DeleteMany>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Reference.DeleteMany>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async deleteMany(@Payload() _: Actions.Reference.DeleteMany) {
    // broadcast only
  }
}

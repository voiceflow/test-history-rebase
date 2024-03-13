/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller } from '@nestjs/common';
import { Action, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext } from '@/common';

@Controller()
@InjectRequestContext()
export class EnvironmentLoguxController {
  @Action(Actions.Environment.UpdateNLUTrainingDiff)
  @Authorize.Permissions<Actions.Environment.UpdateNLUTrainingDiff>([Permission.PROJECT_READ], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Environment.UpdateNLUTrainingDiff>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async updateNLUTrainingDiff(@Payload() _: Actions.Environment.UpdateNLUTrainingDiff) {
    // for broadcast only
  }
}

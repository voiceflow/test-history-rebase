import { Controller, Inject } from '@nestjs/common';
import { Action, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext, UseRequestContext } from '@/common';

import { VersionService } from './version.service';

@Controller()
@InjectRequestContext()
export class VersionLoguxController {
  constructor(
    @Inject(VersionService)
    private readonly service: VersionService
  ) {}

  @Action(Actions.Version.UpdateSettings)
  @Authorize.Permissions<Actions.Version.UpdateSettings>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.Version.UpdateSettings>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  @UseRequestContext()
  async updateSettings(@Payload() { settings, context }: Actions.Version.UpdateSettings) {
    await this.service.updateOneSettings(context.environmentID, settings);
  }
}

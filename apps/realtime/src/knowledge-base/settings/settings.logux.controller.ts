import { Controller, Inject } from '@nestjs/common';
import { Action, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext } from '@/common';

import { KnowledgeBaseSettingsService } from './settings.service';

@Controller()
@InjectRequestContext()
export class KnowledgeBaseSettingsLoguxController {
  constructor(
    @Inject(KnowledgeBaseSettingsService)
    protected readonly service: KnowledgeBaseSettingsService
  ) {}

  @Action(Actions.KnowledgeBaseSettings.Patch)
  @Authorize.Permissions<Actions.KnowledgeBaseSettings.Patch>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.KnowledgeBaseSettings.Patch>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async patch(@Payload() { data, context }: Actions.KnowledgeBaseSettings.Patch) {
    await this.service.updateForAssistant(context.assistantID, data);
  }
}

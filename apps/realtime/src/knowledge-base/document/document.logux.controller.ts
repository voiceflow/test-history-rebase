import { Controller } from '@nestjs/common';
import { Action, Broadcast, Payload } from '@voiceflow/nestjs-logux';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext } from '@/common';

@Controller()
@InjectRequestContext()
export class KnowledgeBaseDocumentLoguxController {
  @Action(Actions.KnowledgeBaseDocument.AddOne)
  @Authorize.Permissions<Actions.KnowledgeBaseDocument.AddOne>([Permission.PROJECT_UPDATE], ({ context }) => ({
    id: context.environmentID,
    kind: 'version',
  }))
  @Broadcast<Actions.KnowledgeBaseDocument.AddOne>(({ context }) => ({ channel: Channels.assistant.build(context) }))
  @BroadcastOnly()
  async addOne(@Payload() _: Actions.KnowledgeBaseDocument.AddOne) {
    // broadcast only
  }
}

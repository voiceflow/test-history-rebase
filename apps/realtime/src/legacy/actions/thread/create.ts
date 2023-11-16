import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { terminateResend } from '@voiceflow/socket-utils';

import { AbstractProjectChannelControl } from '@/legacy/actions/project/utils';

class CreateThread extends AbstractProjectChannelControl<Realtime.thread.CreateThreadPayload> {
  protected actionCreator = Realtime.thread.create.started;

  protected resend = terminateResend;

  protected process = this.reply(Realtime.thread.create, async (ctx, { payload }) => {
    const { creatorID, clientID } = ctx.data;
    const { projectID, workspaceID } = payload;

    const thread = await this.services.legacyThread.create(creatorID, projectID, payload.thread);
    await this.server.processAs(creatorID, clientID, Realtime.thread.crud.add({ workspaceID, projectID, key: thread.id, value: thread }));

    return thread;
  });
}

export default CreateThread;

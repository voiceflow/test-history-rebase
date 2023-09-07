import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { terminateResend } from '@voiceflow/socket-utils';

import { AbstractProjectChannelControl } from '@/legacy/actions/project/utils';

class CreateComment extends AbstractProjectChannelControl<Realtime.thread.CreateCommentPayload> {
  protected actionCreator = Realtime.thread.comment.create.started;

  protected resend = terminateResend;

  protected process = this.reply(Realtime.thread.comment.create, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;
    const { projectID, workspaceID, threadID, comment } = payload;

    const newComment = await this.services.thread.createComment(creatorID, projectID, threadID, comment);
    await this.server.processAs(creatorID, Realtime.thread.comment.add({ workspaceID, projectID, threadID, comment: newComment }));

    return newComment;
  });
}

export default CreateComment;

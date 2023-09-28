import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractProjectChannelControl } from '@/legacy/actions/project/utils';

class DeleteComment extends AbstractProjectChannelControl<Realtime.thread.DeleteCommentPayload> {
  protected actionCreator = Realtime.thread.comment.delete;

  protected process = async (ctx: Context, { payload }: Action<Realtime.thread.DeleteCommentPayload>) => {
    const { creatorID, clientID } = ctx.data;
    const { projectID, commentID, threadID, workspaceID } = payload;

    const thread = await this.services.thread.get(creatorID, projectID, threadID);

    // deleting the last comment also deletes the thread:
    // https://github.com/voiceflow/creator-api/blob/master/lib/models/threadComments.ts#L79-L111
    await this.services.thread.deleteComment(creatorID, projectID, commentID);

    // if last comment in thread, delete the thread:
    if (thread?.comments.length === 1) {
      await this.server.processAs(creatorID, clientID, Realtime.thread.crud.remove({ workspaceID, projectID, key: threadID }));
    }
  };
}

export default DeleteComment;

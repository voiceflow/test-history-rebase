import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractProjectChannelControl } from '@/legacy/actions/project/utils';

class UpdateComment extends AbstractProjectChannelControl<Realtime.thread.UpdateCommentPayload> {
  protected actionCreator = Realtime.thread.comment.update;

  protected process = async (ctx: Context, { payload }: Action<Realtime.thread.UpdateCommentPayload>) => {
    const { creatorID } = ctx.data;
    await this.services.thread.updateComment(creatorID, payload.projectID, payload.commentID, payload.comment);
  };
}

export default UpdateComment;

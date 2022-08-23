import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractProjectChannelControl } from '@/actions/project/utils';

class AddComment extends AbstractProjectChannelControl<Realtime.thread.AddCommentPayload> {
  protected actionCreator = Realtime.thread.comment.add;

  // handled by create
  protected process = Utils.functional.noop;
}

export default AddComment;

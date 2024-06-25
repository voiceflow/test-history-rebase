/* UpdateUnreadComments */

import { Utils } from '@voiceflow/common';
import { Actions } from '@voiceflow/sdk-logux-designer';

export const UpdateUnreadComment = Utils.protocol.createAction<boolean>(
  Actions.Thread.threadAction('UPDATE_UNREAD_COMMENTS')
);

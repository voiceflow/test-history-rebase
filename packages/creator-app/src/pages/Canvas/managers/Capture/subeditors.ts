import { NO_REPLY_PATH_PATH_TYPE, NO_REPLY_PATH_TYPE, NoReplyEditor, NoReplyPathNameEditor } from '@/pages/Canvas/components/NoReply';

// eslint-disable-next-line import/prefer-default-export
export const EDITORS_BY_PATH = {
  [NO_REPLY_PATH_TYPE]: NoReplyEditor,
  [NO_REPLY_PATH_PATH_TYPE]: NoReplyPathNameEditor,
};

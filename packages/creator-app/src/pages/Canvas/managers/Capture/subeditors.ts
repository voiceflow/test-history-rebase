import { NO_REPLY_PATH_PATH_TYPE, NO_REPLY_PATH_TYPE } from '@/pages/Canvas/components/NoReply';

import { NoReplyForm, NoReplyPathNameForm } from './components';

// eslint-disable-next-line import/prefer-default-export
export const EDITORS_BY_PATH = {
  [NO_REPLY_PATH_TYPE]: NoReplyForm,
  [NO_REPLY_PATH_PATH_TYPE]: NoReplyPathNameForm,
};

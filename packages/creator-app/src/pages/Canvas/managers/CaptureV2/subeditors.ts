import { NO_MATCH_PATH_PATH_TYPE, NO_MATCH_PATH_TYPE } from '@/pages/Canvas/components/NoMatch';
import { NO_REPLY_PATH_PATH_TYPE, NO_REPLY_PATH_TYPE } from '@/pages/Canvas/components/NoReply';

import { NoMatchForm, NoMatchPathNameForm, NoReplyForm, NoReplyPathNameForm } from './components';

// eslint-disable-next-line import/prefer-default-export
export const EDITORS_BY_PATH = {
  [NO_MATCH_PATH_TYPE]: NoMatchForm,
  [NO_REPLY_PATH_TYPE]: NoReplyForm,
  [NO_MATCH_PATH_PATH_TYPE]: NoMatchPathNameForm,
  [NO_REPLY_PATH_PATH_TYPE]: NoReplyPathNameForm,
};

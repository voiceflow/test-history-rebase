import IntentSlotForm from '@/components/IntentSlotForm';
import { NO_MATCH_PATH_PATH_TYPE, NO_MATCH_PATH_TYPE, NoMatchEditor, NoMatchPathNameEditor } from '@/pages/Canvas/components/NoMatch';
import { NO_REPLY_PATH_PATH_TYPE, NO_REPLY_PATH_TYPE, NoReplyEditor, NoReplyPathNameEditor } from '@/pages/Canvas/components/NoReply';
import { SLOT_PATH_TYPE } from '@/pages/Canvas/constants';

export const EDITORS_BY_PATH = {
  [SLOT_PATH_TYPE]: IntentSlotForm,
  [NO_MATCH_PATH_TYPE]: NoMatchEditor,
  [NO_REPLY_PATH_TYPE]: NoReplyEditor,
  [NO_MATCH_PATH_PATH_TYPE]: NoMatchPathNameEditor,
  [NO_REPLY_PATH_PATH_TYPE]: NoReplyPathNameEditor,
};

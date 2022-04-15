import { NO_MATCH_PATH_PATH_TYPE, NO_MATCH_PATH_TYPE, NoMatchEditor, NoMatchPathNameEditor } from '@/pages/Canvas/components/NoMatch';
import { NO_REPLY_PATH_PATH_TYPE, NO_REPLY_PATH_TYPE, NoReplyEditor, NoReplyPathNameEditor } from '@/pages/Canvas/components/NoReply';

import { ENTITY_PROMPT_PATH_TYPE, EntityPromptForm } from './components';

export const EDITORS_BY_PATH = {
  [NO_MATCH_PATH_TYPE]: NoMatchEditor,
  [NO_REPLY_PATH_TYPE]: NoReplyEditor,
  [ENTITY_PROMPT_PATH_TYPE]: EntityPromptForm,
  [NO_MATCH_PATH_PATH_TYPE]: NoMatchPathNameEditor,
  [NO_REPLY_PATH_PATH_TYPE]: NoReplyPathNameEditor,
};

import { NO_MATCH_PATH_PATH_TYPE, NO_MATCH_PATH_TYPE, NoMatchEditor, NoMatchPathNameEditor } from '@/pages/Canvas/components/NoMatch';
import { NO_REPLY_PATH_PATH_TYPE, NO_REPLY_PATH_TYPE, NoReplyEditor, NoReplyPathNameEditor } from '@/pages/Canvas/components/NoReply';
import { ButtonsEditor, SUGGESTION_BUTTONS_PATH_TYPE } from '@/pages/Canvas/components/SuggestionButtons';

export const EDITORS_BY_PATH = {
  [NO_MATCH_PATH_TYPE]: NoMatchEditor,
  [NO_REPLY_PATH_TYPE]: NoReplyEditor,
  [NO_MATCH_PATH_PATH_TYPE]: NoMatchPathNameEditor,
  [NO_REPLY_PATH_PATH_TYPE]: NoReplyPathNameEditor,
  [SUGGESTION_BUTTONS_PATH_TYPE]: ButtonsEditor,
};

export type PromptEditors = keyof typeof EDITORS_BY_PATH;

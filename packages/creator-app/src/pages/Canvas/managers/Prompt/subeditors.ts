import { NO_MATCH_PATH_PATH_TYPE, NO_MATCH_PATH_TYPE } from '@/pages/Canvas/components/NoMatch';
import { NO_REPLY_PATH_TYPE, NoReplyEditor } from '@/pages/Canvas/components/NoReply';
import { ButtonsEditor, SUGGESTION_BUTTONS_PATH_TYPE } from '@/pages/Canvas/components/SuggestionButtons';

import { NoMatchForm, NoMatchPathNameForm } from './components';

export const EDITORS_BY_PATH = {
  [NO_MATCH_PATH_TYPE]: NoMatchForm,
  [NO_REPLY_PATH_TYPE]: NoReplyEditor,
  [NO_MATCH_PATH_PATH_TYPE]: NoMatchPathNameForm,
  [SUGGESTION_BUTTONS_PATH_TYPE]: ButtonsEditor,
};

export type PromptEditors = keyof typeof EDITORS_BY_PATH;

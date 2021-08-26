import { NO_MATCH_PATH_TYPE } from '@/pages/Canvas/components/NoMatch';
import { NO_MATCH_PATH_PATH_TYPE } from '@/pages/Canvas/components/NoMatchPath';
import { NO_REPLY_RESPONSE_PATH_TYPE, NoReplyResponseForm } from '@/pages/Canvas/components/NoReplyResponse';
import { ButtonsEditor, SUGGESTION_BUTTONS_PATH_TYPE } from '@/pages/Canvas/components/SuggestionButtons';

import { NoMatchForm } from './components';
import NoMatchPathNameForm from './components/NoMatchPathNameForm';

export const EDITORS_BY_PATH = {
  [NO_MATCH_PATH_TYPE]: NoMatchForm,
  [NO_MATCH_PATH_PATH_TYPE]: NoMatchPathNameForm,
  [NO_REPLY_RESPONSE_PATH_TYPE]: NoReplyResponseForm,
  [SUGGESTION_BUTTONS_PATH_TYPE]: ButtonsEditor,
};

export type PromptEditors = keyof typeof EDITORS_BY_PATH;

import { SLOT_PATH_TYPE } from '@/components/IntentForm/components/Custom/components';
import IntentSlotForm from '@/components/IntentSlotForm';
import { NO_MATCH_PATH_TYPE } from '@/pages/Canvas/components/NoMatch';
import { NO_MATCH_PATH_PATH_TYPE } from '@/pages/Canvas/components/NoMatchPath';
import { NO_REPLY_RESPONSE_PATH_TYPE, NoReplyResponseForm } from '@/pages/Canvas/components/NoReplyResponse';
import { ButtonsEditor, SUGGESTION_BUTTONS_PATH_TYPE } from '@/pages/Canvas/components/SuggestionButtons';

import NoMatchPathNameForm from './components/NoMatchPathNameForm';
import RepromptResponseForm from './components/RepromptResponseForm';

export const EDITORS_BY_PATH = {
  [SLOT_PATH_TYPE]: IntentSlotForm,
  [NO_MATCH_PATH_TYPE]: RepromptResponseForm,
  [NO_MATCH_PATH_PATH_TYPE]: NoMatchPathNameForm,
  [NO_REPLY_RESPONSE_PATH_TYPE]: NoReplyResponseForm,
  [SUGGESTION_BUTTONS_PATH_TYPE]: ButtonsEditor,
};

export type ChoiceManagerEditors = keyof typeof EDITORS_BY_PATH;

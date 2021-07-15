import { NoReplyResponseForm } from '@/pages/Canvas/components/NoReplyResponse';
import { ButtonsEditor } from '@/pages/Canvas/components/SuggestionButtons';

import { RepromptsForm } from './components';
import NoMatchPathNameForm from './components/NoMatchPathNameForm';

export const EDITORS_BY_PATH = {
  buttons: ButtonsEditor,
  reprompts: RepromptsForm,
  noMatchPath: NoMatchPathNameForm,
  noReplyResponse: NoReplyResponseForm,
};

export type PromptEditors = keyof typeof EDITORS_BY_PATH;

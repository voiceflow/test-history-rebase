import IntentSlotForm from '@/components/IntentSlotForm';
import { NoReplyResponseForm } from '@/pages/Canvas/components/NoReplyResponse';
import RepromptResponseForm from '@/pages/Canvas/components/RepromptResponse';
import { ButtonsEditor } from '@/pages/Canvas/components/SuggestionButtons';

export const EDITORS_BY_PATH = {
  slot: IntentSlotForm,
  noReplyResponse: NoReplyResponseForm,
  repromptResponse: RepromptResponseForm,
  buttons: ButtonsEditor,
};

export type ChoiceManagerEditors = keyof typeof EDITORS_BY_PATH;

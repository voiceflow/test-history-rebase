import IntentSlotForm from '@/components/IntentSlotForm';
import { NoReplyResponseForm } from '@/pages/Canvas/components/NoReplyResponse';
import RepromptResponseForm from '@/pages/Canvas/components/RepromptResponse';
import { ChipForm } from '@/pages/Canvas/components/SuggestionChips';

export const EDITORS_BY_PATH = {
  slot: IntentSlotForm,
  noReplyResponse: NoReplyResponseForm,
  repromptResponse: RepromptResponseForm,
  chips: ChipForm,
};

export type ChoiceManagerEditors = keyof typeof EDITORS_BY_PATH;

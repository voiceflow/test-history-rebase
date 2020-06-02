import IntentSlotForm from '@/components/IntentSlotForm';
import { NoReplyResponseForm } from '@/pages/Canvas/components/NoReplyResponse';
import { RepromptResponseForm } from '@/pages/Canvas/components/RepromptResponse';

export const EDITORS_BY_PATH = {
  slot: IntentSlotForm,
  noReplyResponse: NoReplyResponseForm,
  repromptResponse: RepromptResponseForm,
};

export type ChoiceManagerEditors = keyof typeof EDITORS_BY_PATH;

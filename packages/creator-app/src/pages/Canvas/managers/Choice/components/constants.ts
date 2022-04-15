import { BaseNode } from '@voiceflow/base-types';

export const INTENT_ACTION_OPTIONS = [
  {
    id: BaseNode.Interaction.ChoiceAction.PATH,
    label: 'Follow Path',
  },
  {
    id: BaseNode.Interaction.ChoiceAction.GO_TO,
    label: 'Go to Intent',
  },
];

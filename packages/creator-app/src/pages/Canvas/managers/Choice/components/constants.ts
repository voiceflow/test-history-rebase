import { Node as BaseNode } from '@voiceflow/base-types';

// eslint-disable-next-line import/prefer-default-export
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

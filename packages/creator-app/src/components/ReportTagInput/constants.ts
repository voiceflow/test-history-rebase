import { Icon } from '@voiceflow/ui';

export enum InputVariant {
  SELECT_ONLY = 'select_only',
  MANAGE = 'manage',
}

export const DEFAULT_TAGS: { label: string; icon: Icon; id: string }[] = [
  {
    label: 'Positive',
    icon: 'positiveEmotion',
    id: 'positiveEmotion',
  },
  {
    label: 'Neutral',
    icon: 'neutralEmotion',
    id: 'neutralEmotion',
  },
  {
    label: 'Negative',
    icon: 'negativeEmotion',
    id: 'negativeEmotion',
  },
  {
    label: 'Saved for later',
    icon: 'saveForLater',
    id: 'saveForLater',
  },
  {
    label: 'Reviewed',
    icon: 'reviewed',
    id: 'reviewed',
  },
];

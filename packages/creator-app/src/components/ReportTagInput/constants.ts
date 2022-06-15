import { SvgIconTypes } from '@voiceflow/ui';

export enum InputVariant {
  SELECT_ONLY = 'select_only',
  MANAGE = 'manage',
}

export const DEFAULT_TAGS: { label: string; icon: SvgIconTypes.Icon; id: string }[] = [
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

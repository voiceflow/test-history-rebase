/* eslint-disable import/prefer-default-export */
import { Icon } from '@/components/SvgIcon';
import { DialogType } from '@/constants';

export const ICON_COLOR: Record<DialogType, string> = {
  [DialogType.AUDIO]: '#f83f55',
  [DialogType.VOICE]: '#8f8e94',
};

export const ICON: Record<DialogType, Icon> = {
  [DialogType.AUDIO]: 'volume',
  [DialogType.VOICE]: 'speak',
};

export const NAME: Record<DialogType, string> = {
  [DialogType.AUDIO]: 'Audio',
  [DialogType.VOICE]: 'Speak',
};

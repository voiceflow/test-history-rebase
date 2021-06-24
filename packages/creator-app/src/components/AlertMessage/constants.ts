import { Icon } from '@voiceflow/ui';

export enum Variant {
  DANGER = 'danger',
  PRIMARY = 'primary',
  SUCCESS = 'success',
  WARNING = 'warning',
}

export const MESSAGE_VARIANTS: Record<Variant, { icon: null | Icon; color: string }> = {
  [Variant.PRIMARY]: {
    icon: null,
    color: 'primary',
  },
  [Variant.SUCCESS]: {
    icon: 'check',
    color: 'success',
  },
  [Variant.DANGER]: {
    icon: null,
    color: 'danger',
  },
  [Variant.WARNING]: {
    icon: 'warning',
    color: 'warning',
  },
};

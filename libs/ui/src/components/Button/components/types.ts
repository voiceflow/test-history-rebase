import type { ButtonVariant } from '@ui/components/Button/constants';
import type { SvgIconTypes } from '@ui/components/SvgIcon';

export type CommonButtonProps<V extends ButtonVariant, D = Record<string, any>> = {
  icon?: SvgIconTypes.Icon | null;
  variant?: V;
  iconProps?: Omit<SvgIconTypes.Props, 'icon'>;
} & D;

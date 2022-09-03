import type { UIOnlyMenuItemOption } from '../NestedMenu';
import type { OptionsMenuOption } from '../OptionsMenu';
import type { PopperTypes } from '../Popper';

export type Action = OptionsMenuOption | UIOnlyMenuItemOption | null;

export interface ContentProps {
  $fillHeight?: boolean;
}

export interface HeaderProps {
  title: React.ReactNode;
  prefix?: React.ReactNode;
}

export interface HeaderActionsButtonProps {
  actions: Action[];
  placement?: PopperTypes.Placement;
}

export interface FooterActionsButtonProps {
  actions: Action[];
  placement?: PopperTypes.Placement;
}

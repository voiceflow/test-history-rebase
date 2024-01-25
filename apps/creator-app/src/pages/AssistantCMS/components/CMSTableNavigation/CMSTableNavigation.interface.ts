import type { IBreadCrumbs } from '@voiceflow/ui-next';

export interface ICMSTableNavigation extends React.PropsWithChildren {
  label: string;
  items?: IBreadCrumbs['items'];
  actions?: React.ReactNode;
  onImportClick?: VoidFunction;
  onLabelClick?: (resourceURL: string) => void;
}

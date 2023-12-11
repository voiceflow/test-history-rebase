import type { IBreadCrumbs } from '@voiceflow/ui-next';

export interface ICMSTableNavigation {
  label: string;
  items?: IBreadCrumbs['items'];
  actions?: React.ReactNode;
  onImportClick?: VoidFunction;
}

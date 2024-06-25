import type { CMSTableUsedByCellItemType } from './CMSTableUsedByCellItemType.enum';

export interface CMSTableUsedByCellItem {
  id: string;
  type: CMSTableUsedByCellItemType;
  label: string;
  onClick: VoidFunction;
}

export interface ICMSTableUsedByCell {
  getItem?: (id: string | null) => CMSTableUsedByCellItem | null;
  resourceID: string | null;
  referenceResourceIDByResourceIDMap: Partial<Record<string, string>>;
}

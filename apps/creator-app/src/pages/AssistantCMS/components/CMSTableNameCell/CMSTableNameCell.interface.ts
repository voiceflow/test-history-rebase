export interface ICMSTableNameCell<ColumnType extends string> {
  type: ColumnType;
  name: string;
  itemID: string;
  isFolder?: boolean;
  nameTransform?: (label: string) => string;
}

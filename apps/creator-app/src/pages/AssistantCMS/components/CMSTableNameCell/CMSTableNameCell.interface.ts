export interface ICMSTableNameCell<ColumnType extends string> {
  type: ColumnType;
  name: string;
  itemID: string;
  nameTransform?: (label: string) => string;
}

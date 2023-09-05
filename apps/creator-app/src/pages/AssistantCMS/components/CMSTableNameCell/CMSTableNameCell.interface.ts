export interface ICMSTableNameCell<ColumnType extends string> {
  type: ColumnType;
  label: string;
  itemID: string;
}

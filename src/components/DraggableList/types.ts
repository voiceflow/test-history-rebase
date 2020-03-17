export type Handlers = {
  onDrop?: (...args: any[]) => void;
  onDragEnd?: (...args: any[]) => void;
  onReorder?: (...args: any[]) => void;
  onDragStart?: (...args: any[]) => void;
  onDeleteDrop?: (...args: any[]) => void;
  onToggleHoverDelete?: (...args: any[]) => void;

  deleteHovered?: boolean;
};

export type InternalItem<I extends unknown> = {
  key: string;
  type: string;
  item: I;
  index: number;
  itemKey: string;
  deleteHovered?: boolean;
};

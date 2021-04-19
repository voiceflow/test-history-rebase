import { DragSourceMonitor, DropTargetMonitor } from 'react-dnd';

export type InternalItem<I> = {
  key: string;
  type: string;
  item: I;
  index: number;
  itemKey: string;
  deleteHovered?: boolean;
};

export type Handlers<I> = {
  onDrop?: (item: InternalItem<I>, monitor: DropTargetMonitor) => void;
  onDragEnd?: (result: void, monitor: DragSourceMonitor) => void;
  onReorder?: (from: number, to: number) => void;
  onDragStart?: (monitor: DragSourceMonitor) => void;
  onDeleteDrop?: (item: InternalItem<I>, monitor?: DropTargetMonitor) => void;

  deleteHovered?: boolean;
};

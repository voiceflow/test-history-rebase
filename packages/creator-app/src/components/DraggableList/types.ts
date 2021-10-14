import { DragSourceMonitor, DropTargetMonitor } from 'react-dnd';

export interface InternalItem<I> {
  key?: string;
  type?: string;
  item: I;
  index: number;
  itemKey: string;
  isDragActive?: boolean;
  deleteHovered?: boolean;
  isDraggingXEnabled?: boolean;
}

export type DnDItem<I extends { id: string } | any> = Omit<InternalItem<I>, 'type'> & { type: string | symbol };

export interface DnDHandlers<I> {
  onDrop?: (item: DnDItem<I>, monitor: DropTargetMonitor) => void;
  canDrag?: boolean | ((monitor: DragSourceMonitor) => boolean);
  onDragEnd?: (item: I, monitor: DragSourceMonitor) => void;
  onReorder?: (from: number, to: number) => void;
  onDragStart?: (item: I, monitor: DragSourceMonitor) => void;
  onDeleteDrop?: (item: DnDItem<I>, monitor?: DropTargetMonitor) => void;

  deleteHovered?: boolean;
}

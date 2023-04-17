import { DragSourceMonitor, DropTargetMonitor } from 'react-dnd';

export interface InternalItem<I> {
  key?: string;
  type?: string;
  item: I;
  index: number;
  isLast: boolean;
  isFirst: boolean;
  itemKey: string;
  isDragActive?: boolean;
  deleteHovered?: boolean;
  isDraggingXEnabled?: boolean;
}

export type BaseItemData<Item> = Omit<InternalItem<Item>, 'type'>;

export type DnDItem<I extends { id: string } | any> = Omit<InternalItem<I>, 'type'> & { type: string | symbol };

interface DnDDropTargetMonitor<I> extends DropTargetMonitor<DnDItem<I>> {}

interface DnDDragSourceMonitor<I> extends DragSourceMonitor<DnDItem<I>> {}

export interface DnDHandlers<I> {
  onDrop?: (item: DnDItem<I>, monitor: DnDDropTargetMonitor<I>) => void;
  canDrag?: boolean | ((item: DnDItem<I>, monitor: DnDDragSourceMonitor<I>) => boolean);
  canDrop?: (item: DnDItem<I>, monitor: DnDDropTargetMonitor<I>) => boolean;
  onDragEnd?: (item: I, monitor: DnDDragSourceMonitor<I>) => void;
  onReorder?: (from: number, to: number) => void;
  canReorder?: (from: number, to: number) => boolean;
  onDragStart?: (item: I, monitor: DnDDragSourceMonitor<I>) => void;
  onDeleteDrop?: (item: DnDItem<I>, monitor?: DnDDropTargetMonitor<I>) => void;

  deleteHovered?: boolean;
}

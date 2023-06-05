import { DragItem } from '@/constants';
import { LibraryDragItem } from '@/pages/Project/components/StepMenu/constants';

export const isLibraryDragItem = (item: { type: string }): item is LibraryDragItem => item.type === DragItem.LIBRARY;

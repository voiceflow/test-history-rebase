import type * as Realtime from '@voiceflow/realtime-sdk';

import { DragItem } from '@/constants';
import type { LibraryDragItem } from '@/pages/Project/components/StepMenu/constants';

export const isLibraryDragItem = (item: { type: string }): item is LibraryDragItem<Realtime.CustomBlock> => {
  return item.type === DragItem.LIBRARY;
};

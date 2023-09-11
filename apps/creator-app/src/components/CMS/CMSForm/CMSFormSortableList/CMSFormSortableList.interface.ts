import type { ISortableList } from '@voiceflow/ui-next/build/cjs/components/Utility/SortableList/SortableList.interface';

export interface ICMSFormSortableList<Item extends { id: string }> extends ISortableList<Item> {}

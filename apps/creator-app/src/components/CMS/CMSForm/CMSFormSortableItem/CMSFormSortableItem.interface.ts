import type { IDragButton } from '@voiceflow/ui-next/build/cjs/components/Other/DragButton/DragButton.interface';

import type { ICMSFormListItem } from '../CMSFormListItem/CMSFormListItem.interface';

export interface ICMSFormSortableItem extends ICMSFormListItem {
  dragButtonProps: IDragButton;
}

import { SortableList } from '@voiceflow/ui-next';
import React from 'react';

import type { ICMSFormSortableList } from './CMSFormSortableList.interface';

export const CMSFormSortableList = <Item extends { id: string }>({
  getItemKey = (item) => item.id,
  ...props
}: ICMSFormSortableList<Item>): React.ReactElement => (
  <SortableList {...props} getItemKey={getItemKey} activationConstraint={{ distance: 8 }} />
);

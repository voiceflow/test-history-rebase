import type * as Realtime from '@voiceflow/realtime-sdk';
import type { TableTypes } from '@voiceflow/ui';
import dayjs from 'dayjs';
import React from 'react';

const ActionsCell: React.FC<TableTypes.ItemProps<Realtime.Domain>> = ({ item }) => (
  <span>{item.updatedAt ? dayjs(item.updatedAt).fromNow() : ''}</span>
);

export default React.memo(ActionsCell);

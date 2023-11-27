import * as Realtime from '@voiceflow/realtime-sdk';
import { TableTypes } from '@voiceflow/ui';
import React from 'react';

import * as VersionV2 from '@/ducks/versionV2';
import { useSelector } from '@/hooks';

const TypeColumn: React.FC<TableTypes.ItemProps<Realtime.Slot>> = ({ item }) => {
  const slotTypesMap = useSelector(VersionV2.active.entityTypesMapSelector);

  return <>{(item.type && slotTypesMap[item.type]?.label) || item.type}</>;
};

export default TypeColumn;

import * as Realtime from '@voiceflow/realtime-sdk';
import { TableTypes } from '@voiceflow/ui';
import React from 'react';

import { EmptyDash } from '../../../components';

const InputsColumn: React.FC<TableTypes.ItemProps<Realtime.Slot>> = ({ item }) => {
  const values = React.useMemo(
    () =>
      item.inputs
        .map(({ value }) => value.trim())
        .filter(Boolean)
        .join(', '),
    [item.inputs]
  );

  return <>{values || <EmptyDash />}</>;
};

export default InputsColumn;

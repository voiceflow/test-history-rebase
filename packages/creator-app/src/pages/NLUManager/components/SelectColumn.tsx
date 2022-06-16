import { Checkbox, stopPropagation, TableTypes } from '@voiceflow/ui';
import React from 'react';

import { NLUManagerContext } from '@/pages/NLUManager/context';

const SelectColumn = <I extends TableTypes.Item>({ item }: TableTypes.ItemProps<I>): React.ReactElement => {
  const nluManager = React.useContext(NLUManagerContext);

  return (
    <Checkbox
      checked={nluManager.selectedItemIDs.has(item.id)}
      padding={false}
      onClick={stopPropagation()}
      onChange={() => nluManager.toggleSelectedItemID(item.id)}
    />
  );
};

export default SelectColumn;

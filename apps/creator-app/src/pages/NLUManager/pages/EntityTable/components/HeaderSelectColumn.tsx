import { Utils } from '@voiceflow/common';
import { Checkbox, Table } from '@voiceflow/ui';
import React from 'react';

import { NLUManagerContext } from '@/pages/NLUManager/context';

const HeaderSelectColumn: React.FC = () => {
  const table = Table.useContext();
  const nluManager = React.useContext(NLUManagerContext);

  const checked = !!nluManager.selectedEntityIDs.size;

  return (
    <Checkbox
      type={Checkbox.Type.DASH}
      padding={false}
      checked={checked}
      onChange={() => nluManager.setSelectedEntityIDs(checked ? [] : table.items.map(Utils.object.selectID))}
    />
  );
};

export default HeaderSelectColumn;

import { Utils } from '@voiceflow/common';
import { Checkbox, Table } from '@voiceflow/ui';
import React from 'react';

import { VariableType } from '@/constants';
import { OrderedVariable } from '@/hooks';
import { useNLUManager } from '@/pages/NLUManager/context';

const HeaderSelectColumn: React.FC = () => {
  const table = Table.useContext<OrderedVariable>();
  const nluManager = useNLUManager<OrderedVariable>();

  const checked = !!nluManager.selectedItemIDs.size;

  return (
    <Checkbox
      type={Checkbox.Type.DASH}
      padding={false}
      checked={checked}
      onChange={() =>
        nluManager.setSelectedItemIDs(checked ? [] : table.items.filter((item) => item.type !== VariableType.BUILT_IN).map(Utils.object.selectID))
      }
    />
  );
};

export default HeaderSelectColumn;

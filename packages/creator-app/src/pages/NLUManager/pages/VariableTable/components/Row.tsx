import { Table, TableTypes } from '@voiceflow/ui';
import React from 'react';

import ContextMenu from '@/components/ContextMenu';
import { InteractionModelTabType } from '@/constants';
import { useNLUItemMenu } from '@/contexts/NLUContext/hooks';
import { OrderedVariable } from '@/hooks';
import { NLUManagerContext } from '@/pages/NLUManager/context';

const Row: React.FC<TableTypes.ItemProps<OrderedVariable>> = ({ item, children }) => {
  const nluManager = React.useContext(NLUManagerContext);

  const { options } = useNLUItemMenu({
    itemID: item.id,
    itemType: InteractionModelTabType.SLOTS,
    onRename: () => nluManager.setRenamingItemID(item.id),
  });

  return (
    <ContextMenu options={options} selfDismiss>
      {({ isOpen, onContextMenu }) => (
        <Table.Row
          active={isOpen || item.id === nluManager.activeItemID}
          onClick={() => nluManager.toggleActiveItemID(item.id)}
          onContextMenu={onContextMenu}
        >
          {children}
        </Table.Row>
      )}
    </ContextMenu>
  );
};

export default Row;

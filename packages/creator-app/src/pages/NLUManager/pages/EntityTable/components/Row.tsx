import * as Realtime from '@voiceflow/realtime-sdk';
import { ContextMenu, Table, TableTypes } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { useNLUItemMenu } from '@/contexts/NLUContext/hooks';
import { NLUManagerContext } from '@/pages/NLUManager/context';

const Row: React.FC<TableTypes.ConfigurableRowProps<Realtime.Slot>> = ({ item, children, onMouseEnter, onMouseLeave }) => {
  const nluManager = React.useContext(NLUManagerContext);

  const { options } = useNLUItemMenu({
    itemID: item.id,
    itemType: InteractionModelTabType.SLOTS,
    onRename: () => nluManager.setRenamingEntityID(item.id),
  });

  const handleMouseEnter = () => {
    onMouseEnter();
    nluManager.setHovered(item.id);
  };

  const handleMouseLeave = () => {
    onMouseLeave();
    nluManager.setHovered(null);
  };

  return (
    <ContextMenu options={options} selfDismiss>
      {({ isOpen, onContextMenu }) => (
        <Table.Row
          active={isOpen || item.id === nluManager.activeItemID}
          onClick={() => nluManager.toggleActiveItemID(item.id)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onContextMenu={onContextMenu}
        >
          {children}
        </Table.Row>
      )}
    </ContextMenu>
  );
};

export default Row;

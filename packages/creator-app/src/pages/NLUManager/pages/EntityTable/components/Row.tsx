import * as Realtime from '@voiceflow/realtime-sdk';
import { ContextMenu, Divider, Table, TableTypes } from '@voiceflow/ui';
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

  return (
    <ContextMenu options={options} selfDismiss>
      {({ isOpen, onContextMenu }) => (
        <>
          <Table.Row
            active={isOpen || item.id === nluManager.activeItemID}
            onClick={() => nluManager.toggleActiveItemID(item.id)}
            onMouseLeave={onMouseLeave}
            onMouseEnter={onMouseEnter}
            onContextMenu={onContextMenu}
          >
            {children}
          </Table.Row>
          <Divider offset={0} isSecondaryColor />
        </>
      )}
    </ContextMenu>
  );
};

export default Row;

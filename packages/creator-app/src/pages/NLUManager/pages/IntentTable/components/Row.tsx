import * as Realtime from '@voiceflow/realtime-sdk';
import { ContextMenu, Table, TableTypes } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { useNLUItemMenu } from '@/contexts/NLUContext/hooks';
import { NLUManagerContext } from '@/pages/NLUManager/context';
import { isBuiltInIntent } from '@/utils/intent';

const Row: React.FC<TableTypes.ConfigurableRowProps<Realtime.Intent>> = ({ item, children, onMouseEnter, onMouseLeave }) => {
  const nluManager = React.useContext(NLUManagerContext);
  const isActiveItem = item.id === nluManager.activeItemID;

  const { options } = useNLUItemMenu({
    itemID: item.id,
    itemType: InteractionModelTabType.INTENTS,
    onRename: () => nluManager.setRenamingItemID(item.id),
    isBuiltIn: isBuiltInIntent(item.id),
  });

  return (
    <ContextMenu options={options} selfDismiss>
      {({ isOpen, onContextMenu }) => (
        <Table.Row
          active={isOpen || isActiveItem}
          onClick={() => nluManager.toggleActiveItemID(item.id)}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onContextMenu={onContextMenu}
        >
          {children}
        </Table.Row>
      )}
    </ContextMenu>
  );
};

export default Row;

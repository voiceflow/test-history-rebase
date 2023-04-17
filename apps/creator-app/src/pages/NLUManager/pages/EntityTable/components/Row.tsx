import * as Realtime from '@voiceflow/realtime-sdk';
import { ContextMenu, Table, TableTypes } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { useNLUItemMenu } from '@/contexts/NLUContext/hooks';
import { styled } from '@/hocs/styled';
import { NLUManagerContext } from '@/pages/NLUManager/context';

export const TableRow = styled(Table.Row)`
  padding: 15px 27px;
`;

const Row: React.FC<React.PropsWithChildren<TableTypes.ConfigurableRowProps<Realtime.Slot>>> = ({ item, children, onMouseEnter, onMouseLeave }) => {
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
        <TableRow
          active={isOpen || item.id === nluManager.activeItemID}
          onClick={() => nluManager.toggleActiveItemID(item.id)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onContextMenu={onContextMenu}
        >
          {children}
        </TableRow>
      )}
    </ContextMenu>
  );
};

export default Row;

import React from 'react';

import ContextMenu from '@/components/ContextMenu';
import { InteractionModelTabType } from '@/constants';
import { useNLUItemMenu } from '@/contexts/NLUContext/hooks';
import { ItemContainer } from '@/pages/NLUManager/components/Content/components/Table/components/TableItem/components';
import { useTableSearch } from '@/pages/NLUManager/components/Content/hooks';
import { NLUManagerContext } from '@/pages/NLUManager/context';

interface TableItemProps {
  item: { name: string; id: string };
  itemType: InteractionModelTabType;
  isBuiltIn?: boolean;
}

const TableItem: React.FC<TableItemProps> = ({ isBuiltIn, itemType, item, children }) => {
  const { inSearch } = useTableSearch(item.name);

  const { handleSelectItem, selectedItemId } = React.useContext(NLUManagerContext);
  const { options } = useNLUItemMenu({ itemID: item.id, itemType, isBuiltIn, onRename: () => alert('placeholder') });

  return (
    <ContextMenu selfDismiss options={options}>
      {({ onContextMenu, isOpen }) => (
        <ItemContainer
          hide={!inSearch}
          onClick={() => handleSelectItem(item.id)}
          selected={item.id === selectedItemId || isOpen}
          onContextMenu={onContextMenu}
        >
          {children}
        </ItemContainer>
      )}
    </ContextMenu>
  );
};

export default TableItem;

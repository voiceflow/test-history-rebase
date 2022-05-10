import { MenuOption } from '@voiceflow/ui';
import React from 'react';

import ContextMenu from '@/components/ContextMenu';
import { InteractionModelTabType } from '@/constants';
import { NLUContext } from '@/contexts';
import { ItemContainer } from '@/pages/NLUManager/components/Content/components/Table/components/TableItem/components';
import { useTableSearch } from '@/pages/NLUManager/components/Content/hooks';
import { NLUManagerContext } from '@/pages/NLUManager/context';

interface TableItemProps {
  item: { name: string; id: string };
  itemType: InteractionModelTabType;
  isBuiltIn?: boolean;
  additionalContextOptions?: MenuOption<any>[];
}

const TableItem: React.FC<TableItemProps> = ({ additionalContextOptions = [], isBuiltIn, itemType, item, children }) => {
  const startingOptions = additionalContextOptions;
  const { inSearch } = useTableSearch(item.name);
  const { canRenameItem } = React.useContext(NLUContext);

  const { handleSelectItem, deleteItem, selectedItemId } = React.useContext(NLUManagerContext);
  const { canDeleteItem } = React.useContext(NLUContext);

  if (canRenameItem(item.id, itemType)) {
    startingOptions.push(
      ...[
        {
          key: 'rename',
          label: 'Rename',
          onClick: () => alert('rename'),
        },
        { label: 'Divider', divider: true },
      ]
    );
  }

  const contextOptions = !canDeleteItem(item.id, itemType)
    ? startingOptions
    : [...startingOptions, { label: isBuiltIn ? 'Remove' : 'Delete', value: 'delete', onClick: () => deleteItem(item.id, itemType) }];

  return (
    <ContextMenu selfDismiss options={contextOptions}>
      {({ onContextMenu, isOpen }) => (
        <ItemContainer
          onContextMenu={onContextMenu}
          hide={!inSearch}
          selected={item.id === selectedItemId || isOpen}
          onClick={() => handleSelectItem(item.id)}
        >
          {children}
        </ItemContainer>
      )}
    </ContextMenu>
  );
};

export default TableItem;

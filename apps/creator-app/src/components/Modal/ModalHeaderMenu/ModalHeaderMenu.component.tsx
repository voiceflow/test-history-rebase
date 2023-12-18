import { useVirtualizer } from '@tanstack/react-virtual';
import { Utils } from '@voiceflow/common';
import { Box, Menu, MENU_ITEM_MIN_HEIGHT, MenuItem, Popper, Search, SquareButton, VirtualizedContent } from '@voiceflow/ui-next';
import React, { useMemo, useState } from 'react';

import { useDeferredSearch } from '@/hooks/search.hook';

import { IModalHeaderMenu } from './ModalHeaderMenu.interface';

export const ModalHeaderMenu: React.FC<IModalHeaderMenu> = ({ items, activeID, onSelect, notFoundLabel }) => {
  const [listNode, setListNode] = useState<HTMLDivElement | null>(null);

  const search = useDeferredSearch({
    items: useMemo(() => items.filter((item) => item.id !== activeID), [items]),
    searchBy: (item) => item.name,
  });

  const virtualizer = useVirtualizer({
    count: search.items.length,
    estimateSize: () => MENU_ITEM_MIN_HEIGHT,
    getScrollElement: () => listNode,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <Popper
      placement="left-start"
      referenceElement={({ ref, isOpen, onToggle }) => (
        <Box mr={8}>
          <SquareButton ref={ref} size="medium" onClick={onToggle} iconName="Menu" isActive={isOpen} />
        </Box>
      )}
    >
      {({ onClose }) => (
        <Menu
          listRef={setListNode}
          maxHeight={310}
          searchSection={<Search value={search.value} placeholder="Search" onValueChange={search.setValue} />}
        >
          {search.hasItems ? (
            <VirtualizedContent start={virtualItems[0]?.start ?? 0} totalSize={virtualizer.getTotalSize()}>
              {virtualItems.map((virtualRow) => {
                const item = search.items[virtualRow.index];

                if (!item) return null;

                return (
                  <MenuItem
                    key={virtualRow.key}
                    label={item.name}
                    onClick={Utils.functional.chain(onClose, () => onSelect(item.id))}
                    searchValue={search.deferredValue}
                  />
                );
              })}
            </VirtualizedContent>
          ) : (
            <Menu.NotFound label={notFoundLabel} />
          )}
        </Menu>
      )}
    </Popper>
  );
};

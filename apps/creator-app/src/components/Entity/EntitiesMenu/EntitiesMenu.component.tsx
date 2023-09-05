import { useVirtualizer } from '@tanstack/react-virtual';
import { ActionButtons, Menu, MENU_ITEM_MIN_HEIGHT, MenuItem, Search, VirtualizedContent } from '@voiceflow/ui-next';
import React, { useMemo, useRef, useState } from 'react';

import { Designer } from '@/ducks';
import { useDeferredSearch } from '@/hooks/search.hook';
import { useSelector } from '@/hooks/store.hook';
import { useEntityCreateModalV2 } from '@/ModalsV2';

import type { IEntitiesMenu } from './EntitiesMenu.interface';

export const EntitiesMenu: React.FC<IEntitiesMenu> = ({ width, maxHeight = 304, onSelect, excludedEntitiesIDs }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const storeEntities = useSelector(Designer.Entity.selectors.all);
  const entitiesCreateModal = useEntityCreateModalV2();
  const [entitySearch, setEntitySearch] = useState('');
  const [isCreatingEntity, setIsCreatingEntity] = useState(false);

  const entities = useMemo(() => {
    if (!excludedEntitiesIDs) return storeEntities;

    return storeEntities.filter((entity) => !excludedEntitiesIDs.includes(entity.id));
  }, [storeEntities, excludedEntitiesIDs]);

  const search = useDeferredSearch({
    items: entities,
    searchBy: (item) => item.name,
  });

  const virtualizer = useVirtualizer({
    count: search.items.length,
    estimateSize: () => MENU_ITEM_MIN_HEIGHT,
    getScrollElement: () => listRef.current,
  });

  const onCreate = async () => {
    setIsCreatingEntity(true);

    try {
      const entity = await entitiesCreateModal.open({ name: entitySearch, folderID: null });
      onSelect(entity);
    } catch {
      // skip
    } finally {
      setIsCreatingEntity(false);
    }
  };

  const virtualItems = virtualizer.getVirtualItems();
  const virtualStart = virtualItems[0]?.start ?? 0;

  if (isCreatingEntity) return null;

  return (
    <Menu
      width={width}
      listRef={listRef}
      maxHeight={`${maxHeight}px`}
      searchSection={<Search onValueChange={setEntitySearch} placeholder="Search" value={entitySearch} />}
      actionButtons={<ActionButtons firstButton={<ActionButtons.Button label="Create entity" onClick={onCreate} />} />}
    >
      {!!search.items.length && (
        <VirtualizedContent start={virtualStart} totalSize={virtualizer.getTotalSize()}>
          {virtualItems.map(
            (virtualRow) =>
              search.items[virtualRow.index] && (
                <MenuItem
                  key={virtualRow.index}
                  ref={virtualizer.measureElement}
                  label={search.items[virtualRow.index].name}
                  onClick={() => onSelect(search.items[virtualRow.index])}
                  data-index={virtualRow.index}
                  searchValue={entitySearch}
                />
              )
          )}
        </VirtualizedContent>
      )}
    </Menu>
  );
};

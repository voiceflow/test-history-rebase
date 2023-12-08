import { useVirtualizer } from '@tanstack/react-virtual';
import { Entity } from '@voiceflow/dtos';
import { ActionButtons, Menu, MENU_ITEM_MIN_HEIGHT, MenuItem, Search, VirtualizedContent } from '@voiceflow/ui-next';
import React, { useMemo, useRef, useState } from 'react';

import { Designer } from '@/ducks';
import { useEntityCreateModalV2, useEntityEditModalV2 } from '@/hooks/modal.hook';
import { useDeferredSearch } from '@/hooks/search.hook';
import { useSelector } from '@/hooks/store.hook';

import { EntityMenuEmpty } from '../EntityMenuEmpty/EntityMenuEmpty.component';
import type { IEntityMenu } from './EntityMenu.interface';

export const EntityMenu: React.FC<IEntityMenu> = ({ width, onClose, maxHeight = 304, onSelect: onSelectProp, excludeEntitiesIDs }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const storeEntities = useSelector(Designer.Entity.selectors.all);
  const entityEditModal = useEntityEditModalV2();
  const entitiesCreateModal = useEntityCreateModalV2();

  const [isCreating, setIsCreating] = useState(false);

  const entities = useMemo(() => {
    if (!excludeEntitiesIDs) return storeEntities;

    return storeEntities.filter((entity) => !excludeEntitiesIDs.includes(entity.id));
  }, [storeEntities, excludeEntitiesIDs]);

  const search = useDeferredSearch({
    items: entities,
    searchBy: (item) => item.name,
  });

  const virtualizer = useVirtualizer({
    count: search.items.length,
    estimateSize: () => MENU_ITEM_MIN_HEIGHT,
    getScrollElement: () => listRef.current,
  });

  const onSelect = (entity: Entity) => {
    onSelectProp(entity);
    onClose();
  };

  const onCreate = async () => {
    setIsCreating(true);

    try {
      const entity = await entitiesCreateModal.open({ name: search.value, folderID: null });

      onSelect(entity);
    } catch {
      // skip
    } finally {
      setIsCreating(false);
    }
  };

  const onEdit = (entity: Entity) => {
    entityEditModal.openVoid({ entityID: entity.id });
    onClose();
  };

  const virtualItems = virtualizer.getVirtualItems();
  const virtualStart = virtualItems[0]?.start ?? 0;

  if (!storeEntities.length) return <EntityMenuEmpty width={width} />;

  return (
    <Menu
      width={width}
      listRef={listRef}
      maxHeight={`${maxHeight}px`}
      searchSection={<Search value={search.value} placeholder="Search" onValueChange={search.setValue} />}
      actionButtons={
        <ActionButtons
          firstButton={<ActionButtons.Button label={isCreating ? 'Creating entity...' : 'Create entity'} onClick={onCreate} disabled={isCreating} />}
        />
      }
    >
      {!!search.items.length && (
        <VirtualizedContent start={virtualStart} totalSize={virtualizer.getTotalSize()}>
          {virtualItems.map((virtualRow) => {
            const entity = search.items[virtualRow.index];

            if (!entity) return null;

            return (
              <MenuItem.WithButton
                key={virtualRow.index}
                ref={virtualizer.measureElement}
                label={entity.name}
                onClick={() => onSelect(entity)}
                data-index={virtualRow.index}
                searchValue={search.deferredValue}
                suffixButton={{ iconName: 'EditS', onClick: () => onEdit(entity) }}
              />
            );
          })}
        </VirtualizedContent>
      )}
    </Menu>
  );
};

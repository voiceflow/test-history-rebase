import { useVirtualizer } from '@tanstack/react-virtual';
import { Entity } from '@voiceflow/dtos';
import { ActionButtons, Menu, MENU_ITEM_MIN_HEIGHT, Search, VirtualizedContent } from '@voiceflow/ui-next';
import React, { useMemo, useState } from 'react';

import { Designer } from '@/ducks';
import { useEntityCreateModal, useEntityEditModal } from '@/hooks/modal.hook';
import { useDeferredSearch } from '@/hooks/search.hook';
import { useSelector } from '@/hooks/store.hook';

import { EntityMenuEmpty } from '../EntityMenuEmpty/EntityMenuEmpty.component';
import type { IEntityMenu } from './EntityMenu.interface';

export const EntityMenu: React.FC<IEntityMenu> = ({ width, onClose, onSelect: onSelectProp, excludeEntitiesIDs }) => {
  const storeEntities = useSelector(Designer.Entity.selectors.all);
  const entityEditModal = useEntityEditModal();
  const entityCreateModal = useEntityCreateModal();

  const [listNode, setListNode] = useState<HTMLDivElement | null>(null);
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
    getScrollElement: () => listNode,
  });

  const onSelect = (entity: Entity) => {
    onSelectProp(entity);
    onClose();
  };

  const onCreate = async () => {
    setIsCreating(true);

    try {
      const entity = await entityCreateModal.open({ name: search.value, folderID: null });

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

  if (!storeEntities.length) return <EntityMenuEmpty width={width} onCreated={onSelect} />;

  return (
    <Menu
      width={width}
      listRef={setListNode}
      minWidth={search.hasItems ? undefined : 0}
      maxHeight={310}
      searchSection={<Search value={search.value} placeholder="Search" onValueChange={search.setValue} />}
      actionButtons={
        search.hasItems && (
          <ActionButtons
            firstButton={
              <ActionButtons.Button
                label={isCreating ? 'Creating entity...' : 'Create entity'}
                onClick={onCreate}
                disabled={isCreating}
                testID="entity-menu__create"
              />
            }
          />
        )
      }
    >
      {search.hasItems ? (
        <VirtualizedContent start={virtualStart} totalSize={virtualizer.getTotalSize()}>
          {virtualItems.map((virtualRow) => {
            const entity = search.items[virtualRow.index];

            if (!entity) return null;

            return (
              <Menu.Item.WithButton
                key={virtualRow.index}
                ref={virtualizer.measureElement}
                label={entity.name}
                onClick={() => onSelect(entity)}
                data-index={virtualRow.index}
                searchValue={search.deferredValue}
                suffixButton={{ iconName: 'EditS', onClick: () => onEdit(entity) }}
                // TODO: this doesn't appear to work
                testID="entity-menu__item"
              />
            );
          })}
        </VirtualizedContent>
      ) : (
        <Menu.CreateItem label={search.value} onClick={onCreate} disabled={isCreating} testID="entity-menu__item--add" />
      )}
    </Menu>
  );
};

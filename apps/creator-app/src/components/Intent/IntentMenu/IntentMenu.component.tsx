import { useVirtualizer } from '@tanstack/react-virtual';
import { Intent } from '@voiceflow/dtos';
import { ActionButtons, Menu, MENU_ITEM_MIN_HEIGHT, MenuItem, Search, VirtualizedContent } from '@voiceflow/ui-next';
import React, { useState } from 'react';

import { Designer } from '@/ducks';
import { useIntentCreateModalV2, useIntentEditModalV2 } from '@/hooks/modal.hook';
import { useDeferredSearch } from '@/hooks/search.hook';
import { useSelector } from '@/hooks/store.hook';

import { IntentMenuEmpty } from '../IntentMenuEmpty/IntentMenuEmpty.component';
import type { IIntentMenu } from './IntentMenu.interface';

export const IntentMenu: React.FC<IIntentMenu> = ({ width, onClose, onSelect: onSelectProp }) => {
  const intents = useSelector(Designer.Intent.selectors.allWithoutFallback);
  const intentEditModal = useIntentEditModalV2();
  const intentCreateModal = useIntentCreateModalV2();

  const [listNode, setListNode] = useState<HTMLDivElement | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const search = useDeferredSearch({
    items: intents,
    searchBy: (item) => item.name,
  });

  const virtualizer = useVirtualizer({
    count: search.items.length,
    estimateSize: () => MENU_ITEM_MIN_HEIGHT,
    getScrollElement: () => listNode,
  });

  const virtualItems = virtualizer.getVirtualItems();

  const onSelect = (intent: Intent) => {
    onSelectProp(intent);
    onClose();
  };

  const onCreate = async () => {
    setIsCreating(true);

    try {
      const intent = await intentCreateModal.open({ name: search.value, folderID: null });

      onSelect(intent);
    } catch {
      // skip
    } finally {
      setIsCreating(false);
    }
  };

  const onEdit = (intent: Intent) => {
    intentEditModal.openVoid({ intentID: intent.id });
    onClose();
  };

  if (!intents.length) return <IntentMenuEmpty width={width} onCreated={onSelect} />;

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
              <ActionButtons.Button label={isCreating ? 'Creating intent...' : 'Create intent'} onClick={onCreate} disabled={isCreating} />
            }
          />
        )
      }
    >
      {search.hasItems ? (
        <VirtualizedContent start={virtualItems[0]?.start ?? 0} totalSize={virtualizer.getTotalSize()}>
          {virtualItems.map((virtualRow) => {
            const intent = search.items[virtualRow.index];

            if (!intent) return null;

            return (
              <MenuItem.WithButton
                key={virtualRow.key}
                ref={virtualizer.measureElement}
                label={intent.name}
                onClick={() => onSelect(intent)}
                data-index={virtualRow.index}
                searchValue={search.deferredValue}
                suffixButton={{ iconName: 'EditS', onClick: () => onEdit(intent) }}
              />
            );
          })}
        </VirtualizedContent>
      ) : (
        <Menu.CreateItem label={search.value} onClick={onCreate} disabled={isCreating} />
      )}
    </Menu>
  );
};

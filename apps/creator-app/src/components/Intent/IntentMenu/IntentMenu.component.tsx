import { useVirtualizer } from '@tanstack/react-virtual';
import { ActionButtons, Menu, MENU_ITEM_MIN_HEIGHT, MenuItem, Search, VirtualizedContent } from '@voiceflow/ui-next';
import React, { useRef, useState } from 'react';

import { Designer } from '@/ducks';
import { useIntentCreateModalV2 } from '@/hooks/modal.hook';
import { useDeferredSearch } from '@/hooks/search.hook';
import { useSelector } from '@/hooks/store.hook';

import { IntentMenuEmpty } from '../IntentMenuEmpty/IntentMenuEmpty.component';
import type { IIntentMenu } from './IntentMenu.interface';

export const IntentMenu: React.FC<IIntentMenu> = ({ width, onIntentSelect }) => {
  const intents = useSelector(Designer.Intent.selectors.all);
  const createModal = useIntentCreateModalV2();

  const [isCreating, setIsCreating] = useState(false);

  const search = useDeferredSearch({
    items: intents,
    searchBy: (item) => item.name,
  });
  const listRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: search.items.length,
    estimateSize: () => MENU_ITEM_MIN_HEIGHT,
    getScrollElement: () => listRef.current,
  });

  const virtualItems = virtualizer.getVirtualItems();

  const onCreate = async () => {
    setIsCreating(true);

    try {
      const intent = await createModal.open({ name: search.value, folderID: null });

      onIntentSelect(intent);
    } catch {
      // skip
    } finally {
      setIsCreating(false);
    }
  };

  if (!intents.length) return <IntentMenuEmpty width={width} />;

  return (
    <Menu
      width={width}
      listRef={listRef}
      maxHeight="304px"
      searchSection={<Search value={search.value} placeholder="Search" onValueChange={search.setValue} />}
      actionButtons={
        <ActionButtons
          firstButton={<ActionButtons.Button label={isCreating ? 'Creating intent...' : 'Create intent'} onClick={onCreate} disabled={isCreating} />}
        />
      }
    >
      {!!search.items.length && (
        <VirtualizedContent start={virtualItems[0]?.start ?? 0} totalSize={virtualizer.getTotalSize()}>
          {virtualItems.map(
            (virtualRow) =>
              search.items[virtualRow.index] && (
                <MenuItem
                  key={virtualRow.key}
                  ref={virtualizer.measureElement}
                  label={search.items[virtualRow.index].name}
                  onClick={() => search.items[virtualRow.index] && onIntentSelect(search.items[virtualRow.index])}
                  data-index={virtualRow.index}
                  searchValue={search.deferredValue}
                />
              )
          )}
        </VirtualizedContent>
      )}
    </Menu>
  );
};

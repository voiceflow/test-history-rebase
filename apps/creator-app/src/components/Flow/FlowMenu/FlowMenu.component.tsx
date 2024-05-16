import { useVirtualizer } from '@tanstack/react-virtual';
import { Flow } from '@voiceflow/dtos';
import { tid } from '@voiceflow/style';
import { ActionButtons, Menu, MENU_ITEM_MIN_HEIGHT, Search, VirtualizedContent } from '@voiceflow/ui-next';
import React, { useMemo, useState } from 'react';

import { Designer } from '@/ducks';
import { useFlowCreateModal } from '@/hooks/modal.hook';
import { useDeferredSearch } from '@/hooks/search.hook';
import { useSelector } from '@/hooks/store.hook';

import type { IFlowMenu } from './FlowMenu.interface';

export const FlowMenu: React.FC<IFlowMenu> = ({ width = 'fit-content', maxWidth, onClose, onSelect: onSelectProp, excludeIDs }) => {
  const TEST_ID = 'flow-menu';

  const storeFlows = useSelector(Designer.Flow.selectors.all);
  const flowCreateModal = useFlowCreateModal();

  const [listNode, setListNode] = useState<HTMLDivElement | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const entities = useMemo(() => {
    if (!excludeIDs) return storeFlows;

    return storeFlows.filter((flow) => !excludeIDs.includes(flow.id));
  }, [storeFlows, excludeIDs]);

  const search = useDeferredSearch({
    items: entities,
    searchBy: (item) => item.name,
  });

  const virtualizer = useVirtualizer({
    count: search.items.length,
    estimateSize: () => MENU_ITEM_MIN_HEIGHT,
    getScrollElement: () => listNode,
  });

  const onSelect = (flow: Flow) => {
    onSelectProp(flow);
    onClose();
  };

  const onCreate = async () => {
    setIsCreating(true);

    try {
      const flow = await flowCreateModal.open({ name: search.value, folderID: null });

      onSelect(flow);
    } catch {
      // skip
    } finally {
      setIsCreating(false);
    }
  };

  const virtualItems = virtualizer.getVirtualItems();
  const virtualStart = virtualItems[0]?.start ?? 0;

  return (
    <Menu
      width={width}
      testID={TEST_ID}
      listRef={setListNode}
      minWidth={search.hasItems ? maxWidth : 0}
      maxHeight={310}
      searchSection={<Search value={search.value} placeholder="Search" onValueChange={search.setValue} testID={tid(TEST_ID, 'search')} />}
      actionButtons={
        search.hasItems && (
          <ActionButtons
            firstButton={
              <ActionButtons.Button
                label={isCreating ? 'Creating component...' : 'Create component'}
                testID={tid(TEST_ID, 'create')}
                onClick={onCreate}
                disabled={isCreating}
              />
            }
          />
        )
      }
    >
      {search.hasItems ? (
        <VirtualizedContent start={virtualStart} totalSize={virtualizer.getTotalSize()}>
          {virtualItems.map((virtualRow) => {
            const flow = search.items[virtualRow.index];

            if (!flow) return null;

            return (
              <Menu.Item
                key={virtualRow.index}
                ref={virtualizer.measureElement}
                label={flow.name}
                testID={tid(TEST_ID, 'item')}
                onClick={() => onSelect(flow)}
                data-index={virtualRow.index}
                searchValue={search.deferredValue}
              />
            );
          })}
        </VirtualizedContent>
      ) : (
        <Menu.CreateItem label={search.value} onClick={onCreate} disabled={isCreating} testID={tid(TEST_ID, 'item', 'add')} />
      )}
    </Menu>
  );
};

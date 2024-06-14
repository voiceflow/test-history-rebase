import { useVirtualizer } from '@tanstack/react-virtual';
import { Workflow } from '@voiceflow/dtos';
import { tid } from '@voiceflow/style';
import { ActionButtons, Menu, MENU_ITEM_MIN_HEIGHT, Search, VirtualizedContent } from '@voiceflow/ui-next';
import React, { useMemo, useState } from 'react';

import { Permission } from '@/constants/permissions';
import { Designer } from '@/ducks';
import { useWorkflowCreateModal } from '@/hooks/modal.hook';
import { usePermission } from '@/hooks/permission';
import { useDeferredSearch } from '@/hooks/search.hook';
import { useSelector } from '@/hooks/store.hook';

import type { IWorkflowMenu } from './WorkflowMenu.interface';

export const WorkflowMenu: React.FC<IWorkflowMenu> = ({
  width = 'fit-content',
  maxWidth,
  onClose,
  onSelect: onSelectProp,
  excludeIDs,
}) => {
  const TEST_ID = 'workflow-menu';

  const storeWorkflows = useSelector(Designer.Workflow.selectors.all);
  const workflowCreateModal = useWorkflowCreateModal();
  const [canEditCanvas] = usePermission(Permission.PROJECT_CANVAS_UPDATE);

  const [listNode, setListNode] = useState<HTMLDivElement | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const entities = useMemo(() => {
    if (!excludeIDs) return storeWorkflows;

    return storeWorkflows.filter((workflow) => !excludeIDs.includes(workflow.id));
  }, [storeWorkflows, excludeIDs]);

  const search = useDeferredSearch({
    items: entities,
    searchBy: (item) => item.name,
  });

  const virtualizer = useVirtualizer({
    count: search.items.length,
    estimateSize: () => MENU_ITEM_MIN_HEIGHT,
    getScrollElement: () => listNode,
  });

  const onSelect = (workflow: Workflow) => {
    onSelectProp(workflow);
    onClose();
  };

  const onCreate = async () => {
    setIsCreating(true);

    try {
      const workflow = await workflowCreateModal.open({ name: search.value, folderID: null });

      onSelect(workflow);
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
      maxWidth={maxWidth}
      maxHeight={310}
      searchSection={
        <Search
          value={search.value}
          placeholder="Search"
          onValueChange={search.setValue}
          testID={tid(TEST_ID, 'search')}
        />
      }
      actionButtons={
        search.hasItems &&
        canEditCanvas && (
          <ActionButtons
            firstButton={
              <ActionButtons.Button
                label={isCreating ? 'Creating workflow...' : 'Create workflow'}
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
            const workflow = search.items[virtualRow.index];

            if (!workflow) return null;

            return (
              <Menu.Item
                key={virtualRow.index}
                ref={virtualizer.measureElement}
                label={workflow.name}
                testID={tid(TEST_ID, 'item')}
                onClick={() => onSelect(workflow)}
                data-index={virtualRow.index}
                searchValue={search.deferredValue}
              />
            );
          })}
        </VirtualizedContent>
      ) : (
        canEditCanvas && (
          <Menu.CreateItem
            label={search.value}
            onClick={onCreate}
            disabled={isCreating}
            testID={tid(TEST_ID, 'item', 'add')}
          />
        )
      )}
    </Menu>
  );
};

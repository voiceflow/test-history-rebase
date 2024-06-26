import { useVirtualizer } from '@tanstack/react-virtual';
import type { Variable } from '@voiceflow/dtos';
import { ActionButtons, Menu, MENU_ITEM_MIN_HEIGHT, Search, VirtualizedContent } from '@voiceflow/ui-next';
import React, { useMemo, useState } from 'react';

import { Designer } from '@/ducks';
import { useVariableCreateModal, useVariableEditModal } from '@/hooks/modal.hook';
import { useDeferredSearch } from '@/hooks/search.hook';
import { useSelector } from '@/hooks/store.hook';
import { stopPropagation } from '@/utils/handler.util';

import { VariableMenuEmpty } from '../VariableMenuEmpty/VariableMenuEmpty.component';
import type { IVariableMenu } from './VariableMenu.interface';

export const VariableMenu: React.FC<IVariableMenu> = ({
  width,
  onClose,
  onSelect: onSelectProp,
  excludeVariableIDs,
}) => {
  const storeVariables = useSelector(Designer.Variable.selectors.all);
  const variableEditModal = useVariableEditModal();
  const variableCreateModal = useVariableCreateModal();

  const [listNode, setListNode] = useState<HTMLDivElement | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const variables = useMemo(() => {
    if (!excludeVariableIDs) return storeVariables;

    return storeVariables.filter((variable) => !excludeVariableIDs.includes(variable.id));
  }, [storeVariables, excludeVariableIDs]);

  const search = useDeferredSearch({
    items: variables,
    searchBy: (item) => item.name,
  });

  const virtualizer = useVirtualizer({
    count: search.items.length,
    estimateSize: () => MENU_ITEM_MIN_HEIGHT,
    getScrollElement: () => listNode,
  });

  const onSelect = (variable: Variable) => {
    onSelectProp(variable);
    onClose();
  };

  const onCreate = async () => {
    setIsCreating(true);

    try {
      const variable = await variableCreateModal.open({ name: search.value, folderID: null });

      onSelect(variable);
    } catch {
      // skip
    } finally {
      setIsCreating(false);
    }
  };

  const onEdit = (variable: Variable) => {
    variableEditModal.openVoid({ variableID: variable.id });

    onClose();
  };

  const virtualItems = virtualizer.getVirtualItems();
  const virtualStart = virtualItems[0]?.start ?? 0;

  if (!variables.length) return <VariableMenuEmpty width={width} onCreated={onSelect} />;

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
                label={isCreating ? 'Creating variable...' : 'Create variable'}
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
            const variable = search.items[virtualRow.index];

            if (!variable) return null;

            return (
              <Menu.Item.WithButton
                key={virtualRow.index}
                ref={virtualizer.measureElement}
                label={variable.name}
                onClick={stopPropagation(() => onSelect(variable))}
                data-index={virtualRow.index}
                searchValue={search.deferredValue}
                suffixButton={{ iconName: 'EditS', onClick: () => onEdit(variable) }}
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

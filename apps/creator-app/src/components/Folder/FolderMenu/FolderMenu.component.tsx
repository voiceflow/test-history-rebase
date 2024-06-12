import { useVirtualizer } from '@tanstack/react-virtual';
import { Folder } from '@voiceflow/dtos';
import { ActionButtons, Menu, MENU_ITEM_MIN_HEIGHT, Search, VirtualizedContent } from '@voiceflow/ui-next';
import pluralize from 'pluralize';
import React, { useMemo, useState } from 'react';

import { Designer } from '@/ducks';
import { useFolderCreateModal } from '@/hooks/modal.hook';
import { useDeferredSearch } from '@/hooks/search.hook';
import { useSelector } from '@/hooks/store.hook';
import { getFolderScopeLabel } from '@/utils/cms.util';

import { FolderMenuEmpty } from '../FolderMenuEmpty/FolderMenuEmpty.component';
import type { IFolderMenu } from './FolderMenu.interface';
import { FolderMenuItem } from './FolderMenuItem.component';
import { FolderMenuRootItem } from './FolderMenuRootItem.component';

export const FolderMenu: React.FC<IFolderMenu> = ({
  width,
  scope,
  parentID,
  onClose,
  onSelect: onSelectProp,
  excludeIDs,
}) => {
  const ROOT_FOLDER_ID = '__root_folder__';

  const storeFolders = useSelector(Designer.Folder.selectors.allByScope, { folderScope: scope });
  const folderCreateModal = useFolderCreateModal();

  const [listNode, setListNode] = useState<HTMLDivElement | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const folders = useMemo(() => {
    const orderedFolders = [
      ...(excludeIDs?.length ? storeFolders.filter((folder) => !excludeIDs.includes(folder.id)) : storeFolders),
    ].sort((a, b) => a.name.localeCompare(b.name));

    if (!parentID) {
      return orderedFolders;
    }

    return [
      { id: ROOT_FOLDER_ID, name: `All ${pluralize(getFolderScopeLabel(scope), 2)}` } as const,
      ...orderedFolders,
    ];
  }, [scope, storeFolders, parentID, excludeIDs]);

  const search = useDeferredSearch({
    items: folders,
    searchBy: (item) => item.name,
  });

  const virtualizer = useVirtualizer({
    count: search.items.length,
    estimateSize: (index) =>
      MENU_ITEM_MIN_HEIGHT + (index !== search.items.length - 1 && search.items[index]?.id === ROOT_FOLDER_ID ? 9 : 0),
    getScrollElement: () => listNode,
  });

  const virtualItems = virtualizer.getVirtualItems();

  const onSelect = (folder: Folder | null) => {
    onSelectProp(folder);
    onClose();
  };

  const onCreate = async () => {
    setIsCreating(true);

    try {
      const folder = await folderCreateModal.open({ name: search.value, scope, parentID });

      onSelect(folder);
    } catch {
      // skip
    } finally {
      setIsCreating(false);
    }
  };

  if (!folders.length) return <FolderMenuEmpty width={width} scope={scope} parentID={parentID} onCreated={onSelect} />;

  const isRootFolder = (item: { id: string; name: string }): item is { id: typeof ROOT_FOLDER_ID; name: string } =>
    item.id === ROOT_FOLDER_ID;

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
                label={isCreating ? 'Creating folder...' : 'Create folder'}
                onClick={onCreate}
                disabled={isCreating}
              />
            }
          />
        )
      }
    >
      {search.hasItems ? (
        <VirtualizedContent start={virtualItems[0]?.start ?? 0} totalSize={virtualizer.getTotalSize()}>
          {virtualItems.map((virtualRow) => {
            const folder = search.items[virtualRow.index];

            if (!folder) return null;

            if (isRootFolder(folder))
              return (
                <FolderMenuRootItem
                  key={virtualRow.key}
                  ref={virtualizer.measureElement}
                  name={folder.name}
                  index={virtualRow.index}
                  scope={scope}
                  isLast={virtualRow.index === search.items.length - 1}
                  onClick={() => onSelect(null)}
                  searchValue={search.deferredValue}
                />
              );

            return (
              <FolderMenuItem
                key={virtualRow.key}
                ref={virtualizer.measureElement}
                index={virtualRow.index}
                scope={scope}
                folder={folder}
                onClick={() => onSelect(folder)}
                searchValue={search.deferredValue}
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

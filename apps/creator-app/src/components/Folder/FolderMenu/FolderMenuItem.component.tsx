import { forwardRef, HotKeys, Menu } from '@voiceflow/ui-next';
import React, { useMemo } from 'react';

import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';

import type { IFolderMenuItem } from './FolderMenu.interface';

export const FolderMenuItem = forwardRef<HTMLDivElement, IFolderMenuItem>('FolderMenuItem')((
  { index, scope, folder, onClick, searchValue },
  ref
) => {
  const nestedFolderIDs = useSelector(Designer.Folder.selectors.allDeeplyNestedIDsByScopeAndParentID, {
    folderScope: scope,
    parentID: folder.id,
  });
  const allFolderIDs = useMemo(() => [folder.id, ...nestedFolderIDs], [folder.id, nestedFolderIDs]);
  const cmsResourcesSize = useSelector(
    (state) => Designer.utils.getCMSResourceAllByFolderIDsSelector(scope)(state, { folderIDs: allFolderIDs }).length
  );

  return (
    <Menu.Item
      ref={ref}
      label={folder.name}
      onClick={() => onClick()}
      hotKeys={<HotKeys hotKeys={[{ label: String(cmsResourcesSize) }]} />}
      data-index={index}
      searchValue={searchValue}
    />
  );
});

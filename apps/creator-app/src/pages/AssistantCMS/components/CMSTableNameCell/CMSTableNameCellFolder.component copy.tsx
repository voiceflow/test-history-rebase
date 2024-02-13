import { Table } from '@voiceflow/ui-next';
import { useAtomValue } from 'jotai';
import React, { useMemo } from 'react';

import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { useCMSManager } from '@/pages/AssistantCMS/contexts/CMSManager';

import { CMSTableHighlightedTooltip } from '../CMSTableHighlightedTooltip/CMSTableHighlightedTooltip.component';
import type { ICMSTableNameCell } from './CMSTableNameCell.interface';

export const CMSTableNameCellFolder = <ColumnType extends string>({ type, name, itemID, nameTransform }: ICMSTableNameCell<ColumnType>) => {
  const cmsManager = useCMSManager();

  const search = useAtomValue(cmsManager.search);
  const selectors = useAtomValue(cmsManager.selectors);
  const folderScope = useAtomValue(cmsManager.folderScope);

  const nestedFolderIDs = useSelector(Designer.Folder.selectors.allDeeplyNestedIDsByScopeAndParentID, { folderScope, parentID: itemID });
  const allFolderIDs = useMemo(() => [itemID, ...nestedFolderIDs], [itemID, nestedFolderIDs]);

  const resourcesSize = useSelector((state) => selectors.allByFolderIDs(state, { folderIDs: allFolderIDs }).length);
  const patchOne = useDispatch(Designer.Folder.effect.patchOne, itemID);

  const onRename = (name: string) => {
    if (!name.trim()) return;

    patchOne({ name: name.trim() });
  };

  return (
    <Table.Cell.Editable type={type} id={itemID} label={name} onRename={onRename} labelTransform={nameTransform}>
      <CMSTableHighlightedTooltip label={name} search={search} caption={resourcesSize} />
    </Table.Cell.Editable>
  );
};

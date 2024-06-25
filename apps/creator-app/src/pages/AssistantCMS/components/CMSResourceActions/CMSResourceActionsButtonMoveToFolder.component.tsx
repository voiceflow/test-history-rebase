import { Utils } from '@voiceflow/common';
import type { Folder } from '@voiceflow/dtos';
import { notify, Popper, Table } from '@voiceflow/ui-next';
import { useAtomValue, useSetAtom } from 'jotai';
import React, { useMemo } from 'react';

import { FolderMenu } from '@/components/Folder/FolderMenu/FolderMenu.component';
import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { useCMSManager } from '@/pages/AssistantCMS/contexts/CMSManager';

import { CMSResourceActionsButton } from './CMSResourceActionsButton/CMSResourceActionsButton.component';

export const CMSResourceActionsButtonMoveToFolder: React.FC = () => {
  const tableState = Table.useStateMolecule();
  const cmsManager = useCMSManager();

  const effects = useAtomValue(cmsManager.effects);
  const folderID = useAtomValue(cmsManager.folderID);
  const folderScope = useAtomValue(cmsManager.folderScope);
  const actionStates = useAtomValue(cmsManager.actionStates);
  const moveToIsOpen = useAtomValue(actionStates.moveToIsOpen);
  const selectedIDsSet = useAtomValue(tableState.selectedIDs);
  const setSelectedIDs = useSetAtom(tableState.selectedIDs);
  const setMoveToIsOpen = useSetAtom(actionStates.moveToIsOpen);

  const hasFolders = useSelector(Designer.Folder.selectors.hasByScope, { folderScope });
  const getOneByID = useSelector(Designer.Folder.selectors.getOneByID);
  const getAllDeeplyNestedIDsByScopeAndParentID = useSelector(
    Designer.Folder.selectors.getAllDeeplyNestedIDsByScopeAndParentID
  );

  const patchManyFolders = useDispatch(Designer.Folder.effect.patchMany);
  const patchManyResources = useDispatch(effects.patchMany);

  const selectedIDs = useMemo(() => Array.from(selectedIDsSet), [selectedIDsSet]);
  const folderIDs = useMemo(
    () => Array.from(selectedIDs).filter((id) => getOneByID({ id })),
    [getOneByID, selectedIDs]
  );
  const menuExcludeFolderIDs = useMemo(() => {
    const foldersWithChildrenIDs = folderIDs.flatMap((id) => [
      id,
      ...getAllDeeplyNestedIDsByScopeAndParentID({ parentID: id, folderScope }),
    ]);

    return folderID ? [folderID, ...foldersWithChildrenIDs] : foldersWithChildrenIDs;
  }, [folderID, folderIDs, selectedIDs, folderScope, getAllDeeplyNestedIDsByScopeAndParentID]);

  const onSelect = async (folder: Folder | null) => {
    const resourceIDs = Utils.array.withoutValues(Array.from(selectedIDs), folderIDs);

    try {
      await Promise.all([
        folderIDs.length && patchManyFolders(folderIDs, { parentID: folder?.id ?? null }),
        resourceIDs.length && patchManyResources(resourceIDs, { folderID: folder?.id ?? null }),
      ]);

      setSelectedIDs(new Set());

      notify.short.success('Added to folder');
    } catch {
      notify.short.error(`Couldn't move selected items to the '${folder?.name ?? 'root'}' folder. Please try again.`);
    }
  };

  if (!hasFolders) return null;

  return (
    <Popper
      isOpen={moveToIsOpen}
      onClose={() => setMoveToIsOpen(false)}
      placement="bottom-start"
      referenceElement={({ ref, isOpen, onToggle }) => (
        <CMSResourceActionsButton ref={ref} label="Move..." isActive={isOpen} iconName="MoveTo" onClick={onToggle} />
      )}
    >
      {({ onClose }) => (
        <FolderMenu
          scope={folderScope}
          parentID={folderID}
          onSelect={onSelect}
          onClose={onClose}
          excludeIDs={menuExcludeFolderIDs}
        />
      )}
    </Popper>
  );
};

import { Utils } from '@voiceflow/common';
import { Folder } from '@voiceflow/dtos';
import { notify, Table } from '@voiceflow/ui-next';
import { useAtomValue, useSetAtom } from 'jotai';
import React from 'react';

import { Designer } from '@/ducks';
import { useGetAtomValue } from '@/hooks/atom.hook';
import { useFolderCreateModal } from '@/hooks/modal.hook';
import { useDispatch, useGetValueSelector } from '@/hooks/store.hook';
import { useCMSManager } from '@/pages/AssistantCMS/contexts/CMSManager';

import { CMSResourceActionsButton } from './CMSResourceActionsButton/CMSResourceActionsButton.component';

export const CMSResourceActionsButtonCreateFolder: React.FC = () => {
  const createModal = useFolderCreateModal();

  const tableState = Table.useStateMolecule();
  const getAtomValue = useGetAtomValue();
  const cmsManager = useCMSManager();

  const effects = useAtomValue(cmsManager.effects);
  const folderID = useAtomValue(cmsManager.folderID);
  const folderScope = useAtomValue(cmsManager.folderScope);
  const setSelectedIDs = useSetAtom(tableState.selectedIDs);

  const getOneByID = useGetValueSelector(Designer.Folder.selectors.oneByID);

  const patchManyFolders = useDispatch(Designer.Folder.effect.patchMany);
  const patchManyResources = useDispatch(effects.patchMany);

  const onClick = async () => {
    const selectedIDs = getAtomValue(tableState.selectedIDs);

    const folderIDs = Array.from(selectedIDs).filter((id) => getOneByID({ id }));
    const resourceIDs = Utils.array.withoutValues(Array.from(selectedIDs), folderIDs);

    let folder: Folder;

    try {
      folder = await createModal.open({ scope: folderScope, parentID: folderID });
    } catch {
      // closed
      return;
    }

    try {
      await Promise.all([
        folderIDs.length && patchManyFolders(folderIDs, { parentID: folder.id }),
        resourceIDs.length && patchManyResources(resourceIDs, { folderID: folder.id }),
      ]);

      setSelectedIDs(new Set());

      notify.short.success('Folder created');
    } catch {
      notify.short.error(`Couldn't move selected items to the '${folder.name}' folder. Please try again.`);
    }
  };

  return <CMSResourceActionsButton label="Create folder" iconName="Folder" onClick={onClick} />;
};

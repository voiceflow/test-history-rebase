import { Table, toast } from '@voiceflow/ui-next';
import { useAtomValue, useSetAtom } from 'jotai';
import pluralize from 'pluralize';
import React from 'react';

import { useGetAtomValue } from '@/hooks/atom.hook';
import { useConfirmV2Modal } from '@/hooks/modal.hook';
import { useDispatch } from '@/hooks/store.hook';

import { useCMSManager } from '../../../contexts/CMSManager';
import { CMSResourceActionsButton } from '../CMSResourceActionsButton/CMSResourceActionsButton.component';

export const CMSResourceActionsButtonDelete: React.FC = () => {
  const tableState = Table.useStateMolecule();
  const cmsManager = useCMSManager();
  const getAtomValue = useGetAtomValue();

  const effects = useAtomValue(cmsManager.effects);
  const deleteMany = useDispatch(effects.deleteMany);
  const folderScope = useAtomValue(cmsManager.folderScope);
  const confirmModal = useConfirmV2Modal();
  const setSelectedIDs = useSetAtom(tableState.selectedIDs);

  const onConfirmDelete = async () => {
    const selectedIDs = getAtomValue(tableState.selectedIDs);
    const numSelected = selectedIDs.size;

    await deleteMany(Array.from(selectedIDs));
    setSelectedIDs(new Set());

    toast.info(`${numSelected} ${pluralize(folderScope, numSelected)} deleted`, { showIcon: false, isClosable: false });
  };

  const onClick = () => {
    const { size } = getAtomValue(tableState.selectedIDs);
    const label = pluralize(folderScope, size);

    confirmModal.openVoid({
      body: `Deleted ${label} won’t be recoverable unless you restore a previous agent version. Please confirm that you want to continue.`,
      title: `Delete ${label} (${size})`,
      confirm: onConfirmDelete,
      confirmButtonLabel: 'Delete forever',
      confirmButtonVariant: 'alert',
    });
  };

  return <CMSResourceActionsButton label="Delete" iconName="Trash" onClick={onClick} />;
};

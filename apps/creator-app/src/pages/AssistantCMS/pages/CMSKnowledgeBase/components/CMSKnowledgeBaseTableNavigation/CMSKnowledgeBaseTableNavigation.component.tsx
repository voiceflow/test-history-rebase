import { Button, Table, toast } from '@voiceflow/ui-next';
import { useSetAtom } from 'jotai';
import pluralize from 'pluralize';
import React from 'react';

import { useGetAtomValue } from '@/hooks/atom.hook';
import { useConfirmModal } from '@/hooks/modal.hook';
import { CMSTableNavigation } from '@/pages/AssistantCMS/components/CMSTableNavigation/CMSTableNavigation.component';
import { KnowledgeBaseContext } from '@/pages/KnowledgeBase/context';

import { CMSKnowledgeBaseTableNavigationMoreButton } from './CMSKnowledgeBaseTableNavigationMoreButton.component';

export const CMSKnowledgeBaseTableNavigation: React.FC = () => {
  const tableState = Table.useStateMolecule();
  const getAtomValue = useGetAtomValue();
  const { state, actions } = React.useContext(KnowledgeBaseContext);
  const confirmModal = useConfirmModal();
  const count = state.documents.length;
  const setSelectedIDs = useSetAtom(tableState.selectedIDs);

  const onDelete = async () => {
    const selectedIDs = getAtomValue(tableState.selectedIDs);
    const numSelected = selectedIDs.size;

    await selectedIDs.forEach((id) => actions.remove(id));
    setSelectedIDs(new Set());

    toast.success(`${numSelected} deleted`);
  };

  const onClickDelete = () => {
    const { size } = getAtomValue(tableState.selectedIDs);

    confirmModal.openVoid({
      body: `Are you sure you want to delete ${pluralize('item', size, true)}? This action cannot be undone.`,
      header: `Delete data source (${size})`,
      confirm: onDelete,
      confirmButtonText: 'Delete forever',
    });
  };

  return (
    <CMSTableNavigation
      label={`All data sources (${count})`}
      actions={
        <>
          <Button label="Delete" iconName="Trash" size="medium" variant="secondary" onClick={onClickDelete} />
          <CMSKnowledgeBaseTableNavigationMoreButton />
        </>
      }
    />
  );
};

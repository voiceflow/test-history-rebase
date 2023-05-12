import { Utils } from '@voiceflow/common';
import { Checkbox, stopPropagation, Table, TableTypes } from '@voiceflow/ui';
import React from 'react';

import { useConfirmModal } from '@/ModalsV2/hooks';
import { KnowledgeBaseContext, KnowledgeBaseTableItem } from '@/pages/KnowledgeBase/context';

export const HeaderSelectColumn: React.FC = () => {
  const table = Table.useContext();
  const knowledgeBase = React.useContext(KnowledgeBaseContext);

  const checked = !!knowledgeBase.table.selectedItemIDs.size;

  return (
    <Checkbox
      type={Checkbox.Type.DASH}
      padding={false}
      checked={checked}
      onChange={() => knowledgeBase.table.setSelectedItemIDs(checked ? [] : table.items.map(Utils.object.selectID))}
    />
  );
};

export const SelectColumn = ({ item }: TableTypes.ItemProps<KnowledgeBaseTableItem>): React.ReactElement => {
  const knowledgeBase = React.useContext(KnowledgeBaseContext);
  const isSelected = knowledgeBase.table.selectedItemIDs.has(item.id);

  return (
    <Checkbox checked={isSelected} padding={false} onClick={stopPropagation()} onChange={() => knowledgeBase.table.toggleSelectedItemID(item.id)} />
  );
};

export const KnowledgeBaseToolbar: React.FC = () => {
  const knowledgeBase = React.useContext(KnowledgeBaseContext);
  const confirmModal = useConfirmModal();

  const resetSelection = () => {
    knowledgeBase.table.setSelectedItemIDs([]);
  };

  const deleteSelection = async () => {
    await Promise.all(Array.from(knowledgeBase.table.selectedItemIDs).map(knowledgeBase.actions.remove));
    resetSelection();
  };

  const confirmDelete = () => {
    confirmModal.open({
      header: 'Delete Items',
      confirm: deleteSelection,
      confirmButtonText: 'Delete',
      body: (
        <>
          Are you sure you want to delete {knowledgeBase.table.selectedItemIDs.size} item(s)?
          <br />
          This action cannot be undone.
        </>
      ),
    });
  };

  return (
    <Table.Toolbar width={450} isOpen={knowledgeBase.table.selectedItemIDs.size >= 1}>
      <Table.Toolbar.LeftActions>
        <Table.Toolbar.SelectCheckbox onClick={resetSelection} />
        <Table.Toolbar.TextBox>{knowledgeBase.table.selectedItemIDs.size} documents selected</Table.Toolbar.TextBox>
      </Table.Toolbar.LeftActions>

      <Table.Toolbar.Actions>
        <Table.Toolbar.Icon icon="trash" onClick={confirmDelete} />
      </Table.Toolbar.Actions>
    </Table.Toolbar>
  );
};

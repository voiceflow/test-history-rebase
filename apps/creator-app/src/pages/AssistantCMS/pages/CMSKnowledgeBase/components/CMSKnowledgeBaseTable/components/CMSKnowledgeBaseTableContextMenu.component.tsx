import { BaseModels } from '@voiceflow/base-types';
import { Table, toast } from '@voiceflow/ui-next';
import { useSetAtom } from 'jotai';
import React from 'react';

import { CMSKnowledgeBaseContext } from '@/pages/AssistantCMS/contexts/CMSKnowledgeBase.context';

import { CMSKnowledgeBaseRowActions } from '../../CMSKnowledgeBaseRowActions.component';

interface ITableContextMenu {
  id: string;
  type: BaseModels.Project.KnowledgeBaseDocumentType;
  onClose: VoidFunction;
}

export const TableContextMenu: React.FC<ITableContextMenu> = ({ id, type, onClose }) => {
  const table = Table.useStateMolecule();
  const setActiveID = useSetAtom(table.activeID);
  const { actions } = React.useContext(CMSKnowledgeBaseContext);

  const onResync = async () => {
    try {
      toast.info('Syncing', { isClosable: false });
      await actions.resync([id]);
      toast.success('Synced', { isClosable: false });
    } catch {
      toast.error('Failed to sync data source', { isClosable: false });
    }
  };

  const onDelete = async () => {
    setActiveID(null);
    actions.remove(id);
  };

  return (
    <CMSKnowledgeBaseRowActions
      documentID={id}
      onDelete={onDelete}
      onResync={onResync}
      isURL={type === BaseModels.Project.KnowledgeBaseDocumentType.URL}
      onClose={onClose}
    />
  );
};

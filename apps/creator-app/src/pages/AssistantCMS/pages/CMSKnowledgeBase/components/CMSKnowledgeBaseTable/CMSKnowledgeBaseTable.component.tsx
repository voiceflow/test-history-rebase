import { BaseModels } from '@voiceflow/base-types';
import { EmptyPage, Table } from '@voiceflow/ui-next';
import { type Atom, atom, useSetAtom } from 'jotai';
import React from 'react';

import { CMS_KNOWLEDGE_BASE_LEARN_MORE } from '@/constants/link.constant';
import { container } from '@/pages/AssistantCMS/components/CMSEmpty/CMSEmpty.css';
import { CMSKnowledgeBase } from '@/pages/AssistantCMS/contexts/CMSManager/CMSManager.interface';
import { KnowledgeBaseContext, KnowledgeBaseTableItem } from '@/pages/KnowledgeBase/context';

import { useKBDocumentSync } from '../../CMSKnowledgeBase.hook';
import { knowledgeBaseColumnsOrderAtom } from './CMSKnowledgeBaseTable.atom';
import { CMS_KNOWLEDGE_BASE_TABLE_CONFIG } from './CMSKnowledgeBaseTable.config';
import { TableContextMenu } from './components/CMSKnowledgeBaseTableContextMenu.component';

const DEFAULT_POLL_INTERVAL = 5000;

const isProcessing = (item: KnowledgeBaseTableItem) =>
  ![BaseModels.Project.KnowledgeBaseDocumentStatus.SUCCESS, BaseModels.Project.KnowledgeBaseDocumentStatus.ERROR].includes(item.status.type);

export const CMSKnowledgeBaseTable: React.FC = () => {
  const { state, actions } = React.useContext(KnowledgeBaseContext);
  const [items, setItems] = React.useState<Atom<Atom<CMSKnowledgeBase>[]>>(atom([]));
  const { clearSync, syncInterval } = useKBDocumentSync();
  const stateMolecule = Table.useStateMolecule();

  const setActiveID = useSetAtom(stateMolecule.activeID);
  const isEmpty = state.documents.length === 0;

  const onRowClick = (id: string) => {
    setActiveID((prevID) => (prevID === id ? null : id));
  };

  React.useEffect(() => {
    const processing = state.documents.some(isProcessing);
    setItems(atom(state.documents.map((item) => atom(item))));

    if (processing && !syncInterval.current) {
      syncInterval.current = window.setInterval(() => {
        actions.sync();
      }, DEFAULT_POLL_INTERVAL);
    } else if (!processing) {
      clearSync();
    }
  }, [state.documents]);

  if (isEmpty) {
    return (
      <div className={container}>
        <EmptyPage
          title="No data sources exist"
          button={{ label: 'Add data source', onClick: () => {} }}
          description="Add data sources to your assistant to build a knowledge base of material."
          illustration="NoData"
          learnMoreLink={CMS_KNOWLEDGE_BASE_LEARN_MORE}
        />
      </div>
    );
  }

  return (
    <Table
      config={CMS_KNOWLEDGE_BASE_TABLE_CONFIG}
      itemsAtom={items}
      columnsOrderAtom={knowledgeBaseColumnsOrderAtom}
      onRowClick={onRowClick}
      rowContextMenu={({ id, onClose }) => <TableContextMenu id={id} onClose={onClose} />}
    />
  );
};

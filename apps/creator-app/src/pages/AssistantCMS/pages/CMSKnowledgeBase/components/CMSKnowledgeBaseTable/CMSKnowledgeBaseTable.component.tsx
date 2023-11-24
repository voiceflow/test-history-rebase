import { BaseModels } from '@voiceflow/base-types';
import { EmptyPage, Table } from '@voiceflow/ui-next';
import { type Atom, atom } from 'jotai';
import React from 'react';

import { CMS_KNOWLEDGE_BASE_LEARN_MORE } from '@/constants/link.constant';
import { container } from '@/pages/AssistantCMS/components/CMSEmpty/CMSEmpty.css';
import { CMSKnowledgeBase } from '@/pages/AssistantCMS/contexts/CMSManager/CMSManager.interface';
import { KnowledgeBaseContext, KnowledgeBaseTableItem } from '@/pages/KnowledgeBase/context';

import { useCMSKnowledgeBaseRowItemClick, useKBDocumentSync } from '../../CMSKnowledgeBase.hook';
import { CMSKnowledgeBaseEditor } from '../CMSKnowledgeBaseEditor/CMSKnowledgeBaseEditor.component';
import { knowledgeBaseColumnsOrderAtom } from './CMSKnowledgeBaseTable.atom';
import { CMS_KNOWLEDGE_BASE_TABLE_CONFIG } from './CMSKnowledgeBaseTable.config';
import { DEFAULT_POLL_INTERVAL } from './CMSKnowledgeBaseTable.constant';
import { TableContextMenu } from './components/CMSKnowledgeBaseTableContextMenu.component';

const isProcessing = (item: KnowledgeBaseTableItem) =>
  ![BaseModels.Project.KnowledgeBaseDocumentStatus.SUCCESS, BaseModels.Project.KnowledgeBaseDocumentStatus.ERROR].includes(item.status.type);

export const CMSKnowledgeBaseTable: React.FC = () => {
  const { state, actions, filter } = React.useContext(KnowledgeBaseContext);
  const [items, setItems] = React.useState<Atom<Atom<CMSKnowledgeBase>[]>>(atom([]));
  const { clearSync, syncInterval } = useKBDocumentSync();
  const onRowClick = useCMSKnowledgeBaseRowItemClick();

  const isEmpty = state.documents.length === 0;

  const onRowContextMenu = ({ id, onClose }: { id: string; onClose: VoidFunction }) => {
    const document = state.documents.find((document) => document.documentID === id);
    if (
      !document ||
      document.status.type === BaseModels.Project.KnowledgeBaseDocumentStatus.PENDING ||
      document.status.type === BaseModels.Project.KnowledgeBaseDocumentStatus.INITIALIZED
    )
      return undefined;

    return <TableContextMenu id={id} onClose={onClose} />;
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

  React.useEffect(() => {
    const lowercaseSearchString = filter.search.toLowerCase();
    const filteredItems = state.documents.filter((item) => item.data.name.toLowerCase().includes(lowercaseSearchString));

    setItems(atom(filteredItems.map((item) => atom(item))));
  }, [filter.search]);

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
    <CMSKnowledgeBaseEditor>
      <Table
        config={CMS_KNOWLEDGE_BASE_TABLE_CONFIG}
        itemsAtom={items}
        columnsOrderAtom={knowledgeBaseColumnsOrderAtom}
        onRowClick={onRowClick}
        rowContextMenu={onRowContextMenu}
      />
    </CMSKnowledgeBaseEditor>
  );
};

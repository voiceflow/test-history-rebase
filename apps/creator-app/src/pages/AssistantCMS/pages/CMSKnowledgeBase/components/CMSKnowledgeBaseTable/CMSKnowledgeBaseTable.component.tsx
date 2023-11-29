import { BaseModels } from '@voiceflow/base-types';
import { EmptyPage, Table } from '@voiceflow/ui-next';
import { atom } from 'jotai';
import React from 'react';

import { CMS_KNOWLEDGE_BASE_LEARN_MORE } from '@/constants/link.constant';
import { container } from '@/pages/AssistantCMS/components/CMSEmpty/CMSEmpty.css';
import { KnowledgeBaseContext, KnowledgeBaseTableItem } from '@/pages/KnowledgeBase/context';

import { useCMSKnowledgeBaseRowItemClick, useKBDocumentSync } from '../../CMSKnowledgeBase.hook';
import { CMSKnowledgeBaseEditor } from '../CMSKnowledgeBaseEditor/CMSKnowledgeBaseEditor.component';
import { knowledgeBaseColumnsOrderAtom } from './CMSKnowledgeBaseTable.atom';
import { CMS_KNOWLEDGE_BASE_TABLE_CONFIG } from './CMSKnowledgeBaseTable.config';
import { TableContextMenu } from './components/CMSKnowledgeBaseTableContextMenu.component';

const isProcessing = (item: KnowledgeBaseTableItem) =>
  ![BaseModels.Project.KnowledgeBaseDocumentStatus.SUCCESS, BaseModels.Project.KnowledgeBaseDocumentStatus.ERROR].includes(item.status.type);

export const CMSKnowledgeBaseTable: React.FC = () => {
  const { state, filter } = React.useContext(KnowledgeBaseContext);
  const kbSync = useKBDocumentSync();
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

  const processing = React.useMemo(() => state.documents.some(isProcessing), [state.documents]);

  React.useEffect(() => {
    if (processing) {
      kbSync.start();
    } else {
      kbSync.cancel();
    }
  }, [processing]);

  const itemsAtom = React.useMemo(() => {
    const lowercaseSearchString = filter.search.toLowerCase().trim();

    const filteredItems = lowercaseSearchString
      ? state.documents.filter((item) => item.data.name.toLowerCase().trim().includes(lowercaseSearchString))
      : state.documents;

    return atom(filteredItems.map((item) => atom(item)));
  }, [state.documents, state.processingDocumentIds, filter.search]);

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
        itemsAtom={itemsAtom}
        onRowClick={onRowClick}
        rowContextMenu={onRowContextMenu}
        columnsOrderAtom={knowledgeBaseColumnsOrderAtom}
      />
    </CMSKnowledgeBaseEditor>
  );
};

import { BaseModels } from '@voiceflow/base-types';
import { Box, EmptyPage, Link, Table, usePersistFunction } from '@voiceflow/ui-next';
import { atom } from 'jotai';
import React from 'react';

import { CMS_KNOWLEDGE_BASE_LEARN_MORE } from '@/constants/link.constant';
import { container } from '@/pages/AssistantCMS/components/CMSEmpty/CMSEmpty.css';
import { CMSKnowledgeBaseContext, KnowledgeBaseTableItem } from '@/pages/AssistantCMS/contexts/CMSKnowledgeBase.context';

import { useCMSKnowledgeBaseRowItemClick, useKBDocumentSync } from '../../CMSKnowledgeBase.hook';
import { CMSKnowledgeBaseEditor } from '../CMSKnowledgeBaseEditor/CMSKnowledgeBaseEditor.component';
import { CMSAddDataSourceButton } from '../CMSKnowledgeBaseHeader/components/AddDataSourceButton.component';
import { knowledgeBaseColumnsOrderAtom } from './CMSKnowledgeBaseTable.atom';
import { CMS_KNOWLEDGE_BASE_TABLE_CONFIG } from './CMSKnowledgeBaseTable.config';
import { emptyPageDescriptonStyle } from './CMSKnowledgeBaseTable.css';
import { TableContextMenu } from './components/CMSKnowledgeBaseTableContextMenu.component';

const isProcessing = (item: KnowledgeBaseTableItem) =>
  ![BaseModels.Project.KnowledgeBaseDocumentStatus.SUCCESS, BaseModels.Project.KnowledgeBaseDocumentStatus.ERROR].includes(item.status.type);

export const CMSKnowledgeBaseTable: React.FC = () => {
  const { state, actions } = React.useContext(CMSKnowledgeBaseContext);
  const kbSync = useKBDocumentSync();
  const onRowClick = useCMSKnowledgeBaseRowItemClick();

  const onRowContextMenu = usePersistFunction(({ id, onClose }: { id: string; onClose: VoidFunction }) => {
    const document = state.documents.find((document) => document.documentID === id);
    if (
      !document ||
      document.status.type === BaseModels.Project.KnowledgeBaseDocumentStatus.PENDING ||
      document.status.type === BaseModels.Project.KnowledgeBaseDocumentStatus.INITIALIZED
    )
      return undefined;

    return <TableContextMenu id={id} onClose={onClose} type={document.data.type} />;
  });

  const processing = React.useMemo(() => state.documents.some(isProcessing), [state.documents]);

  React.useEffect(() => {
    if (processing) {
      kbSync.start();
    } else {
      kbSync.cancel();
    }
  }, [processing]);

  const itemsAtom = React.useMemo(() => {
    const lowercaseSearchString = state.search.toLowerCase().trim();

    const filteredItems = lowercaseSearchString
      ? state.documents.filter((item) => item.data.name.toLowerCase().trim().includes(lowercaseSearchString))
      : state.documents;

    return atom(filteredItems.map((item) => atom(item)));
  }, [state.documents, state.search]);

  const isEmpty = state.documents.length === 0;
  const isSearchEmpty = itemsAtom.init.length === 0 && state.search !== '';

  const onClearFilter = () => {
    actions.setSearch('');
  };

  const emptyPageDescription = (
    <Box direction="column" align="center" justify="center">
      <Box direction="column" align="center" justify="center" className={emptyPageDescriptonStyle}>
        Add data sources to your assistant to build a knowledge base of material.{` `}
        <Link className={emptyPageDescriptonStyle} label="Learn more" href={CMS_KNOWLEDGE_BASE_LEARN_MORE} />
      </Box>
      <Box width="100%" justify="center" my={16}>
        <CMSAddDataSourceButton buttonVariant="primary" />
      </Box>
    </Box>
  );

  if (isEmpty) {
    return (
      <div className={container}>
        <EmptyPage title="No data sources exist" description={emptyPageDescription} illustration="NoData" />
      </div>
    );
  }

  if (isSearchEmpty) {
    return (
      <div className={container}>
        <EmptyPage
          title="No results found"
          button={{ label: 'Clear filters', onClick: onClearFilter, variant: 'secondary' }}
          description="Based on your search we couldn't find any matching content."
          illustration="NoContent"
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

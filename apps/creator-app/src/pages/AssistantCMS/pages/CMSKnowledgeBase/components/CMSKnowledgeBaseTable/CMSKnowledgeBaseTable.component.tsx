import { Table } from '@voiceflow/ui-next';
import React from 'react';

import { CMS_KNOWLEDGE_BASE_LEARN_MORE } from '@/constants/link.constant';
import { CMSEmpty } from '@/pages/AssistantCMS/components/CMSEmpty/CMSEmpty.component';
import { useCMSRowItemClick } from '@/pages/AssistantCMS/hooks/cms-row-item.hook';

import { useKnowledgeBaseCMSManager } from '../../CMSKnowledgeBase.hook';
import { knowledgeBaseColumnsOrderAtom } from './CMSKnowledgeBaseTable.atom';
import { CMS_KNOWLEDGE_BASE_TABLE_CONFIG } from './CMSKnowledgeBaseTable.config';

export const CMSKnowledgeBaseTable: React.FC = () => {
  const knowledgeBaseCMSManager = useKnowledgeBaseCMSManager();
  const onRowClick = useCMSRowItemClick();

  return (
    <CMSEmpty
      title="No data sources exist"
      button={{ label: 'Add data source', onClick: () => {} }}
      searchTitle="No data sources found"
      description="Add data sources to your assistant to build a knowledge base of material."
      illustration="NoData"
      learnMoreLink={CMS_KNOWLEDGE_BASE_LEARN_MORE}
    >
      <Table
        config={CMS_KNOWLEDGE_BASE_TABLE_CONFIG}
        itemsAtom={knowledgeBaseCMSManager.dataToRender}
        columnsOrderAtom={knowledgeBaseColumnsOrderAtom}
        onRowClick={onRowClick}
      />
    </CMSEmpty>
  );
};

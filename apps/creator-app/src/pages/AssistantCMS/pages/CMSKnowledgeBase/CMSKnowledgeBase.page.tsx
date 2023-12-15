import { Table } from '@voiceflow/ui-next';
import React from 'react';

import { CMSKnowledgeBaseHeader } from './components/CMSKnowledgeBaseHeader/CMSKnowledgeBaseHeader.component';
import { CMSKnowledgeBaseTable } from './components/CMSKnowledgeBaseTable/CMSKnowledgeBaseTable.component';
import { KnowledgeBaseTableColumn } from './components/CMSKnowledgeBaseTable/CMSKnowledgeBaseTable.constant';
import { CMSKnowledgeBaseTableNavigation } from './components/CMSKnowledgeBaseTableNavigation/CMSKnowledgeBaseTableNavigation.component';

const CMSKnowledgeBase: React.FC = () => {
  const config = React.useMemo(() => ({ orderBy: KnowledgeBaseTableColumn.NAME }), []);

  return (
    <>
      <Table.StateProvider value={config}>
        <CMSKnowledgeBaseHeader />

        <CMSKnowledgeBaseTableNavigation />

        <CMSKnowledgeBaseTable />
      </Table.StateProvider>
    </>
  );
};

export default CMSKnowledgeBase;

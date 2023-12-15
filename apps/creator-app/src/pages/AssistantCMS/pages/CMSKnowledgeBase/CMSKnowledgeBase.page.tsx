import { Table } from '@voiceflow/ui-next';
import React from 'react';

import { CMSPageLoader } from '../../components/CMSPageLoader';
import { CMSKnowledgeBaseContext } from '../../contexts/CMSKnowledgeBase.context';
import { CMSKnowledgeBaseHeader } from './components/CMSKnowledgeBaseHeader/CMSKnowledgeBaseHeader.component';
import { CMSKnowledgeBaseTable } from './components/CMSKnowledgeBaseTable/CMSKnowledgeBaseTable.component';
import { KnowledgeBaseTableColumn } from './components/CMSKnowledgeBaseTable/CMSKnowledgeBaseTable.constant';
import { CMSKnowledgeBaseTableNavigation } from './components/CMSKnowledgeBaseTableNavigation/CMSKnowledgeBaseTableNavigation.component';

const CMSKnowledgeBase: React.FC = () => {
  const [loaded, setLoaded] = React.useState(false);
  const config = React.useMemo(() => ({ orderBy: KnowledgeBaseTableColumn.DATE }), []);
  const { actions } = React.useContext(CMSKnowledgeBaseContext);

  const load = async () => {
    await actions.sync();
    setLoaded(true);
  };

  React.useEffect(() => {
    load();
  }, []);

  return (
    <>
      {loaded ? (
        <Table.StateProvider value={config}>
          <CMSKnowledgeBaseHeader />

          <CMSKnowledgeBaseTableNavigation />

          <CMSKnowledgeBaseTable />
        </Table.StateProvider>
      ) : (
        <CMSPageLoader />
      )}
    </>
  );
};

export default CMSKnowledgeBase;

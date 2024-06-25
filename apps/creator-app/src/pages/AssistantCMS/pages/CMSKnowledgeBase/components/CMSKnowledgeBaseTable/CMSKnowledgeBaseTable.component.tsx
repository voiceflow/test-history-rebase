import { tid } from '@voiceflow/style';
import { Box, Link, Table, usePersistFunction } from '@voiceflow/ui-next';
import { useAtomValue } from 'jotai';
import React, { useEffect } from 'react';

import { CMS_KNOWLEDGE_BASE_LEARN_MORE } from '@/constants/link.constant';
import * as Tracking from '@/ducks/tracking';
import { useDispatch } from '@/hooks';
import { useSessionStorageState } from '@/hooks/storage.hook';
import { useGetValueSelector } from '@/hooks/store.hook';
import { EMPTY_TEST_ID, TABLE_TEST_ID } from '@/pages/AssistantCMS/AssistantCMS.constant';
import { CMSEmpty } from '@/pages/AssistantCMS/components/CMSEmpty/CMSEmpty.component';
import { useCMSRowItemClick, useCMSRowItemNavigate } from '@/pages/AssistantCMS/hooks/cms-row-item.hook';

import { pendingStatusSet } from '../../CMSKnowledgeBase.constants';
import { useKBDocumentSync, useKnowledgeBaseCMSManager } from '../../CMSKnowledgeBase.hook';
import { CMSKnowledgeBaseAddDataSourceButton } from '../CMSKnowledgeBaseAddDataSourceButton/CMSKnowledgeBaseAddDataSourceButton.component';
import { CMSKnowledgeBaseRowActions } from '../CMSKnowledgeBaseRowActions/CMSKnowledgeBaseRowActions.component';
import { knowledgeBaseColumnsOrderAtom } from './CMSKnowledgeBaseTable.atom';
import { CMS_KNOWLEDGE_BASE_TABLE_CONFIG } from './CMSKnowledgeBaseTable.config';

export const CMSKnowledgeBaseTable: React.FC = () => {
  const onRowClick = useCMSRowItemClick();
  const onRowNavigate = useCMSRowItemNavigate();
  const knowledgeBaseManager = useKnowledgeBaseCMSManager();
  const selectors = useAtomValue(knowledgeBaseManager.selectors);
  const getOneByID = useGetValueSelector(selectors.oneByID);
  const trackAiKnowledgeBaseOpen = useDispatch(Tracking.trackAiKnowledgeBaseOpen);
  const [cmsKBPageOpen, setCMSKBPageOpen] = useSessionStorageState('CMS.KB.page-open', false);

  const onRowContextMenu = usePersistFunction(({ id, onClose }: { id: string; onClose: VoidFunction }) => {
    const document = getOneByID({ id });

    if (!document || pendingStatusSet.has(document.status)) {
      return null;
    }

    return <CMSKnowledgeBaseRowActions id={id} onClose={onClose} />;
  });

  useKBDocumentSync();

  useEffect(() => {
    if (!cmsKBPageOpen) {
      trackAiKnowledgeBaseOpen();
      setCMSKBPageOpen(true);
    }
  }, []);

  return (
    <CMSEmpty
      title="No data sources exist"
      searchTitle="No data sources found"
      description={
        <Box direction="column" align="center" justify="center">
          <div>
            Add data sources to your agent to build a knowledge base of material.{' '}
            <Link
              inline
              label="Learn more"
              href={CMS_KNOWLEDGE_BASE_LEARN_MORE}
              target="_blank"
              testID={tid(EMPTY_TEST_ID, 'learn-more')}
            />
          </div>

          <Box width="100%" justify="center" my={16}>
            <CMSKnowledgeBaseAddDataSourceButton testID={tid(EMPTY_TEST_ID, 'add-source')} />
          </Box>
        </Box>
      }
      illustration="NoData"
    >
      <Table
        config={CMS_KNOWLEDGE_BASE_TABLE_CONFIG}
        itemsAtom={knowledgeBaseManager.dataToRender}
        onRowClick={onRowClick}
        onRowNavigate={onRowNavigate}
        rowContextMenu={onRowContextMenu}
        columnsOrderAtom={knowledgeBaseColumnsOrderAtom}
        testID={TABLE_TEST_ID}
      />
    </CMSEmpty>
  );
};

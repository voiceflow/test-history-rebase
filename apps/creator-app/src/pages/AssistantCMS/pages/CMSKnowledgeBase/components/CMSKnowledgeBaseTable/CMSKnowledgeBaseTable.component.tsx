import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Link, Table, usePersistFunction } from '@voiceflow/ui-next';
import { atom, useAtomValue } from 'jotai';
import React, { useMemo } from 'react';

import { CMS_KNOWLEDGE_BASE_LEARN_MORE } from '@/constants/link.constant';
import * as Tracking from '@/ducks/tracking';
import { useGetAtomValue } from '@/hooks/atom.hook';
import { useFeature } from '@/hooks/feature';
import { useGetValueSelector } from '@/hooks/store.hook';
import { CMSEmpty } from '@/pages/AssistantCMS/components/CMSEmpty/CMSEmpty.component';
import { useCMSRowItemClick, useCMSRowItemNavigate } from '@/pages/AssistantCMS/hooks/cms-row-item.hook';

import { pendingStatusSet } from '../../CMSKnowledgeBase.constants';
import { useKBDocumentSync, useKnowledgeBaseCMSManager } from '../../CMSKnowledgeBase.hook';
import { CMSKnowledgeBaseAddDataSourceButton } from '../CMSKnowledgeBaseAddDataSourceButton/CMSKnowledgeBaseAddDataSourceButton.component';
import { CMSKnowledgeBaseRowActions } from '../CMSKnowledgeBaseRowActions/CMSKnowledgeBaseRowActions.component';
import { knowledgeBaseColumnsOrderAtom } from './CMSKnowledgeBaseTable.atom';
import { CMS_KNOWLEDGE_BASE_TABLE_CONFIG } from './CMSKnowledgeBaseTable.config';
import { KnowledgeBaseTableColumn } from './CMSKnowledgeBaseTable.constant';

export const CMSKnowledgeBaseTable: React.FC = () => {
  const { isEnabled: isRefreshEnabled } = useFeature(Realtime.FeatureFlag.KB_REFRESH);

  const onRowClick = useCMSRowItemClick();
  const getAtomValue = useGetAtomValue();
  const onRowNavigate = useCMSRowItemNavigate();
  const knowledgeBaseManager = useKnowledgeBaseCMSManager();
  const selectors = useAtomValue(knowledgeBaseManager.selectors);
  const getOneByID = useGetValueSelector(selectors.oneByID);

  const columnsOrderAtom = useMemo(
    () =>
      isRefreshEnabled
        ? knowledgeBaseColumnsOrderAtom
        : atom(getAtomValue(knowledgeBaseColumnsOrderAtom).filter((cfg) => cfg.type !== KnowledgeBaseTableColumn.REFRESH)),
    [isRefreshEnabled]
  );

  const onRowContextMenu = usePersistFunction(({ id, onClose }: { id: string; onClose: VoidFunction }) => {
    const document = getOneByID({ id });

    if (!document || pendingStatusSet.has(document.status)) {
      return null;
    }

    return <CMSKnowledgeBaseRowActions id={id} onClose={onClose} />;
  });

  useKBDocumentSync();
  Tracking.trackAiKnowledgeBaseOpen();

  return (
    <CMSEmpty
      title="No data sources exist"
      searchTitle="No data sources found"
      description={
        <Box direction="column" align="center" justify="center">
          <div>
            Add data sources to your assistant to build a knowledge base of material.{` `}
            <Link inline label="Learn more" href={CMS_KNOWLEDGE_BASE_LEARN_MORE} target="_blank" />
          </div>

          <Box width="100%" justify="center" my={16}>
            <CMSKnowledgeBaseAddDataSourceButton />
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
        columnsOrderAtom={columnsOrderAtom}
      />
    </CMSEmpty>
  );
};

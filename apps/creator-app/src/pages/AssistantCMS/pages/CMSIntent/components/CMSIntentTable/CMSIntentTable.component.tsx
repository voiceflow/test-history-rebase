import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { tid } from '@voiceflow/style';
import { Table } from '@voiceflow/ui-next';
import React from 'react';

import { CMS_INTENT_LEARN_MORE } from '@/constants/link.constant';
import { useFeature } from '@/hooks/feature';
import { EMPTY_TEST_ID, TABLE_TEST_ID } from '@/pages/AssistantCMS/AssistantCMS.constant';
import { isIntentBuiltIn } from '@/utils/intent.util';

import { CMSEmpty } from '../../../../components/CMSEmpty/CMSEmpty.component';
import {
  useCMSRowItemClick,
  useCMSRowItemContextMenu,
  useCMSRowItemNavigate,
} from '../../../../hooks/cms-row-item.hook';
import { useIntentCMSManager, useOnIntentCreate } from '../../CMSIntent.hook';
import { intentColumnsOrderAtom, legacyIntentColumnsOrderAtom } from './CMSIntentTable.atom';
import { INTENTS_TABLE_CONFIG } from './CMSIntentTable.config';
import { IntentTableColumn } from './CMSIntentTable.constant';

export const CMSIntentTable: React.FC = () => {
  const intentsUsedBy = useFeature(FeatureFlag.INTENTS_USED_BY);

  const onCreate = useOnIntentCreate();
  const onRowClick = useCMSRowItemClick();
  const onRowNavigate = useCMSRowItemNavigate();
  const rowContextMenu = useCMSRowItemContextMenu({
    canRename: (resourceID) => !isIntentBuiltIn(resourceID),
    nameColumnType: IntentTableColumn.NAME,
  });
  const intentCMSManager = useIntentCMSManager();

  return (
    <CMSEmpty
      title="No intents exist"
      button={{
        label: 'Create intent',
        onClick: (search) => onCreate({ name: search }),
        testID: tid(EMPTY_TEST_ID, 'create-intent'),
      }}
      searchTitle="No intents found"
      description="Intents are reusable collections of user says that aim to capture a users intention. "
      illustration="NoContent"
      learnMoreLink={CMS_INTENT_LEARN_MORE}
    >
      <Table
        config={INTENTS_TABLE_CONFIG}
        testID={TABLE_TEST_ID}
        itemsAtom={intentCMSManager.dataToRender}
        onRowClick={onRowClick}
        onRowNavigate={onRowNavigate}
        rowContextMenu={rowContextMenu}
        columnsOrderAtom={intentsUsedBy.isEnabled ? intentColumnsOrderAtom : legacyIntentColumnsOrderAtom}
      />
    </CMSEmpty>
  );
};

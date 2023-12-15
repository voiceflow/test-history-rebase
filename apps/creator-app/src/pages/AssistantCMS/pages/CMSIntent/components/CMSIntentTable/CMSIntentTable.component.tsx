import { Table } from '@voiceflow/ui-next';
import React from 'react';

import { CMS_INTENT_LEARN_MORE } from '@/constants/link.constant';
import { isIntentBuiltIn } from '@/utils/intent.util';

import { CMSEmpty } from '../../../../components/CMSEmpty/CMSEmpty.component';
import { useCMSRowItemClick, useCMSRowItemContextMenu, useCMSRowItemNavigate } from '../../../../hooks/cms-row-item.hook';
import { useIntentCMSManager, useOnIntentCreate } from '../../CMSIntent.hook';
import { intentColumnsOrderAtom } from './CMSIntentTable.atom';
import { INTENTS_TABLE_CONFIG } from './CMSIntentTable.config';
import { IntentTableColumn } from './CMSIntentTable.constant';

export const CMSIntentTable: React.FC = () => {
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
      button={{ label: 'Create intent', onClick: (search) => onCreate({ name: search }) }}
      searchTitle="No intents found"
      description="Intents are reusable collections of user says that aim to capture a users intention. "
      illustration="NoContent"
      learnMoreLink={CMS_INTENT_LEARN_MORE}
    >
      <Table
        config={INTENTS_TABLE_CONFIG}
        itemsAtom={intentCMSManager.dataToRender}
        onRowClick={onRowClick}
        onRowNavigate={onRowNavigate}
        rowContextMenu={rowContextMenu}
        columnsOrderAtom={intentColumnsOrderAtom}
      />
    </CMSEmpty>
  );
};

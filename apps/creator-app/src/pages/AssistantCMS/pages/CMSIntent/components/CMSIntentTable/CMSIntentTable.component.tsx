import { Table } from '@voiceflow/ui-next';
import React from 'react';

import { CMS_INTENT_LEARN_MORE } from '@/constants/link.constant';
import { clipboardCopy } from '@/utils/clipboard.util';

import { CMSEmpty } from '../../../../components/CMSEmpty/CMSEmpty.component';
import { useCMSRowItemClick, useCMSRowItemContextMenu } from '../../../../hooks/cms-row-item.hook';
import { useIntentCMSManager, useOnIntentCreate } from '../../CMSIntent.hook';
import { intentColumnsOrderAtom } from './CMSIntentTable.atom';
import { INTENTS_TABLE_CONFIG } from './CMSIntentTable.config';
import { IntentTableColumn } from './CMSIntentTable.constant';

export const CMSIntentTable: React.FC = () => {
  const onCreate = useOnIntentCreate();
  const onRowClick = useCMSRowItemClick();
  const rowContextMenu = useCMSRowItemContextMenu({
    onCopyLink: clipboardCopy,
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
        rowContextMenu={rowContextMenu}
        columnsOrderAtom={intentColumnsOrderAtom}
      />
    </CMSEmpty>
  );
};

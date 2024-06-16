import { tid } from '@voiceflow/style';
import { Table } from '@voiceflow/ui-next';
import React from 'react';

import { CMS_ENTITY_LEARN_MORE } from '@/constants/link.constant';
import { EMPTY_TEST_ID, TABLE_TEST_ID } from '@/pages/AssistantCMS/AssistantCMS.constant';

import { CMSEmpty } from '../../../../components/CMSEmpty/CMSEmpty.component';
import {
  useCMSRowItemClick,
  useCMSRowItemContextMenu,
  useCMSRowItemNavigate,
} from '../../../../hooks/cms-row-item.hook';
import { useEntityCMSManager, useOnEntityCreate } from '../../CMSEntity.hook';
import { entityColumnsOrderAtom } from './CMSEntityTable.atom';
import { CMS_ENTITY_TABLE_CONFIG } from './CMSEntityTable.config';
import { EntityTableColumn } from './CMSEntityTable.constant';

export const CMSEntityTable: React.FC = () => {
  const onCreate = useOnEntityCreate();
  const onRowClick = useCMSRowItemClick();
  const onRowNavigate = useCMSRowItemNavigate();
  const rowContextMenu = useCMSRowItemContextMenu({
    nameColumnType: EntityTableColumn.NAME,
  });
  const entityCMSManager = useEntityCMSManager();

  return (
    <CMSEmpty
      title="No entities exist"
      button={{
        label: 'Create entity',
        onClick: (search) => onCreate({ name: search }),
        testID: tid(EMPTY_TEST_ID, 'create-entity'),
      }}
      searchTitle="No entities found"
      description="Entities help your agent know which data to pluck out from the users response. "
      illustration="NoContent"
      learnMoreLink={CMS_ENTITY_LEARN_MORE}
    >
      <Table
        config={CMS_ENTITY_TABLE_CONFIG}
        itemsAtom={entityCMSManager.dataToRender}
        onRowClick={onRowClick}
        onRowNavigate={onRowNavigate}
        rowContextMenu={rowContextMenu}
        columnsOrderAtom={entityColumnsOrderAtom}
        testID={TABLE_TEST_ID}
      />
    </CMSEmpty>
  );
};

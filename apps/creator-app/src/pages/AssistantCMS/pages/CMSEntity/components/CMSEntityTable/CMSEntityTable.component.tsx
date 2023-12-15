import { Table } from '@voiceflow/ui-next';
import React from 'react';

import { CMS_ENTITY_LEARN_MORE } from '@/constants/link.constant';

import { CMSEmpty } from '../../../../components/CMSEmpty/CMSEmpty.component';
import { useCMSRowItemClick, useCMSRowItemContextMenu, useCMSRowItemNavigate } from '../../../../hooks/cms-row-item.hook';
import { useEntityCMSManager, useOnEntityCreate } from '../../CMSEntity.hook';
import { entityColumnsOrderAtom } from './CMSEntityTable.atom';
import { CMS_ENTITY_TABLE_CONFIG } from './CMSEntityTable.config';
import { EntityTableColumn } from './CMSEntityTable.constant';

export const CMSEntityTable: React.FC = () => {
  const onCreate = useOnEntityCreate();
  const onRowClick = useCMSRowItemClick();
  const onRowNavigate = useCMSRowItemNavigate();
  const rowContextMenu = useCMSRowItemContextMenu({ nameColumnType: EntityTableColumn.NAME });
  const entityCMSManager = useEntityCMSManager();

  return (
    <CMSEmpty
      title="No entities exist"
      button={{ label: 'Create entity', onClick: (search) => onCreate({ name: search }) }}
      searchTitle="No entities found"
      description="Entities help your assistant know which data to pluck out from the users response. "
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
      />
    </CMSEmpty>
  );
};

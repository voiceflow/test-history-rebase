import { Table } from '@voiceflow/ui-next';
import React from 'react';

import { CMSRoute } from '@/config/routes';
import { CMS_RESPONSE_LEARN_MORE } from '@/constants/link.constant';
import { Designer } from '@/ducks';
import { goToCMSResource } from '@/ducks/router';
import { useDispatch } from '@/hooks';

import { CMSEmpty } from '../../../../components/CMSEmpty/CMSEmpty.component';
import {
  useCMSRowItemClick,
  useCMSRowItemContextMenu,
  useCMSRowItemNavigate,
} from '../../../../hooks/cms-row-item.hook';
import { useOnResponseCreate, useResponseCMSManager } from '../../CMSMessage.hook';
import { responseColumnsOrderAtom } from './CMSMessageTable.atom';
import { CMS_RESPONSE_TABLE_CONFIG } from './CMSMessageTable.config';
import { ResponseTableColumn } from './CMSMessageTable.constant';

export const CMSMessageTable: React.FC = () => {
  const onCreate = useOnResponseCreate();
  const onRowClick = useCMSRowItemClick();
  const cmsManager = useResponseCMSManager();
  const onRowNavigate = useCMSRowItemNavigate();
  const duplicateOne = useDispatch(Designer.Response.effect.duplicateOne);

  const rowContextMenu = useCMSRowItemContextMenu({
    canRename: (_, { isFolder }) => isFolder,
    onDuplicate: async (id) => {
      const data = await duplicateOne(id);

      goToCMSResource(CMSRoute.MESSAGE, data.responseResource.id);
    },
    canDuplicate: (_, { isFolder }) => !isFolder,
    nameColumnType: ResponseTableColumn.ALL,
  });

  return (
    <CMSEmpty
      title="No messages exist"
      button={{ label: 'Create message', onClick: (search) => onCreate({ name: search }) }}
      searchTitle="No messages found"
      description="Messages determine how your agent will respond to the user. "
      illustration="NoContent"
      learnMoreLink={CMS_RESPONSE_LEARN_MORE}
    >
      <Table
        config={CMS_RESPONSE_TABLE_CONFIG}
        itemsAtom={cmsManager.dataToRender}
        onRowClick={onRowClick}
        onRowNavigate={onRowNavigate}
        rowContextMenu={rowContextMenu}
        columnsOrderAtom={responseColumnsOrderAtom}
      />
    </CMSEmpty>
  );
};

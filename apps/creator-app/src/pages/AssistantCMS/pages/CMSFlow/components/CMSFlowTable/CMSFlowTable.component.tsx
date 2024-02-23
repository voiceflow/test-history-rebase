import { Table } from '@voiceflow/ui-next';
import React from 'react';

import { CMS_FLOW_LEARN_MORE } from '@/constants/link.constant';
import { Designer, Session } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks';

import { CMSEmpty } from '../../../../components/CMSEmpty/CMSEmpty.component';
import { useCMSRowItemClick, useCMSRowItemContextMenu, useCMSRowItemNavigate } from '../../../../hooks/cms-row-item.hook';
import { useFlowCMSManager, useOnFlowCreate } from '../../CMSFlow.hook';
import { flowColumnsOrderAtom } from './CMSFlowTable.atom';
import { CMS_COMPONENT_TABLE_CONFIG } from './CMSFlowTable.config';
import { FlowTableColumn } from './CMSFlowTable.constant';

export const CMSFlowTable: React.FC = () => {
  const onCreate = useOnFlowCreate();
  const onRowClick = useCMSRowItemClick();
  const cmsManager = useFlowCMSManager();
  const onRowNavigate = useCMSRowItemNavigate();
  const duplicateOne = useDispatch(Designer.Flow.effect.duplicateOne);
  const activeVersionID = useSelector(Session.activeVersionIDSelector)!;
  const rowContextMenu = useCMSRowItemContextMenu({
    nameColumnType: FlowTableColumn.NAME,
    onDuplicate: (flowID) => duplicateOne(activeVersionID, flowID, { notification: true }),
  });

  return (
    <CMSEmpty
      title="No components exist"
      button={{ label: 'Create component', onClick: (search) => onCreate({ name: search }) }}
      searchTitle="No components found"
      description="Components are saved sets of blocks that you can reuse across your agent. "
      illustration="VFComponent"
      learnMoreLink={CMS_FLOW_LEARN_MORE}
    >
      <Table
        config={CMS_COMPONENT_TABLE_CONFIG}
        itemsAtom={cmsManager.dataToRender}
        onRowClick={onRowClick}
        onRowNavigate={onRowNavigate}
        rowContextMenu={rowContextMenu}
        columnsOrderAtom={flowColumnsOrderAtom}
      />
    </CMSEmpty>
  );
};

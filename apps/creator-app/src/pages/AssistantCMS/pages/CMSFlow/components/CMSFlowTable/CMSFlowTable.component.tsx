import { Table, usePersistFunction } from '@voiceflow/ui-next';
import React from 'react';

import { CMS_FLOW_LEARN_MORE } from '@/constants/link.constant';
import { Designer, Router } from '@/ducks';
import { useDispatch } from '@/hooks';
import { useGetValueSelector } from '@/hooks/store.hook';

import { CMSEmpty } from '../../../../components/CMSEmpty/CMSEmpty.component';
import { useCMSRowItemClick, useCMSRowItemContextMenu, useCMSRowItemNavigate } from '../../../../hooks/cms-row-item.hook';
import { useFlowCMSManager, useOnFlowCreate } from '../../CMSFlow.hook';
import { flowColumnsOrderAtom } from './CMSFlowTable.atom';
import { CMS_FLOW_TABLE_CONFIG } from './CMSFlowTable.config';
import { FlowTableColumn } from './CMSFlowTable.constant';

export const CMSFlowTable: React.FC = () => {
  const onCreate = useOnFlowCreate();
  const onRowClick = useCMSRowItemClick();
  const cmsManager = useFlowCMSManager();
  const onRowNavigate = useCMSRowItemNavigate();

  const goToDiagram = useDispatch(Router.goToDiagram);
  const duplicateOne = useDispatch(Designer.Flow.effect.duplicateOne);

  const getOneByID = useGetValueSelector(Designer.Workflow.selectors.oneByID);

  const rowContextMenu = useCMSRowItemContextMenu({
    onDuplicate: duplicateOne,
    nameColumnType: FlowTableColumn.NAME,
  });

  const onRowDoubleClick = usePersistFunction((id: string) => {
    const workflow = getOneByID({ id });

    if (workflow) {
      goToDiagram(workflow.id);
    }
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
        config={CMS_FLOW_TABLE_CONFIG}
        itemsAtom={cmsManager.dataToRender}
        onRowClick={onRowClick}
        onRowNavigate={onRowNavigate}
        rowContextMenu={rowContextMenu}
        onRowDoubleClick={onRowDoubleClick}
        columnsOrderAtom={flowColumnsOrderAtom}
      />
    </CMSEmpty>
  );
};

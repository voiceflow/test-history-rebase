import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { Table, usePersistFunction } from '@voiceflow/ui-next';
import React from 'react';

import { CMS_FLOW_LEARN_MORE } from '@/constants/link.constant';
import { Designer, Router } from '@/ducks';
import { useFeature } from '@/hooks/feature.hook';
import { useDispatch, useGetValueSelector } from '@/hooks/store.hook';

import { CMSEmpty } from '../../../../components/CMSEmpty/CMSEmpty.component';
import {
  useCMSRowItemClick,
  useCMSRowItemContextMenu,
  useCMSRowItemNavigate,
} from '../../../../hooks/cms-row-item.hook';
import { useFlowCMSManager, useOnFlowCreate } from '../../CMSFlow.hook';
import { flowColumnsOrderAtom, legacyFlowColumnsOrderAtom } from './CMSFlowTable.atom';
import { CMS_FLOW_TABLE_CONFIG } from './CMSFlowTable.config';
import { FlowTableColumn } from './CMSFlowTable.constant';

export const CMSFlowTable: React.FC = () => {
  const componentsUsedBY = useFeature(FeatureFlag.COMPONENTS_USED_BY);

  const onCreate = useOnFlowCreate();
  const onRowClick = useCMSRowItemClick();
  const cmsManager = useFlowCMSManager();
  const onRowNavigate = useCMSRowItemNavigate();

  const goToDiagram = useDispatch(Router.goToDiagram);
  const duplicateOne = useDispatch(Designer.Flow.effect.duplicateOne);

  const getOneByID = useGetValueSelector(Designer.Flow.selectors.oneByID);

  const rowContextMenu = useCMSRowItemContextMenu({
    onDuplicate: duplicateOne,
    canDuplicate: (_, { isFolder }) => !isFolder,
    nameColumnType: FlowTableColumn.NAME,
  });

  const onRowDoubleClick = usePersistFunction((id: string) => {
    const flow = getOneByID({ id });

    if (flow) {
      goToDiagram(flow.diagramID);
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
        columnsOrderAtom={componentsUsedBY ? flowColumnsOrderAtom : legacyFlowColumnsOrderAtom}
      />
    </CMSEmpty>
  );
};

import { Table } from '@voiceflow/ui-next';
import React from 'react';

import { CMS_WORKFLOW_LEARN_MORE } from '@/constants/link.constant';
import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks';

import { CMSEmpty } from '../../../../components/CMSEmpty/CMSEmpty.component';
import { useCMSRowItemClick, useCMSRowItemContextMenu, useCMSRowItemNavigate } from '../../../../hooks/cms-row-item.hook';
import { useOnWorkflowCreate, useWorkflowCMSManager } from '../../CMSWorkflow.hook';
import { workflowColumnsOrderAtom } from './CMSWorkflowTable.atom';
import { CMS_WORKFLOW_TABLE_CONFIG } from './CMSWorkflowTable.config';
import { WorkflowTableColumn } from './CMSWorkflowTable.constant';

export const CMSWorkflowTable: React.FC = () => {
  const onCreate = useOnWorkflowCreate();
  const onRowClick = useCMSRowItemClick();
  const cmsManager = useWorkflowCMSManager();
  const onRowNavigate = useCMSRowItemNavigate();

  const duplicateOne = useDispatch(Designer.Flow.effect.duplicateOne);

  const rowContextMenu = useCMSRowItemContextMenu({
    nameColumnType: WorkflowTableColumn.NAME,
    onDuplicate: duplicateOne,
  });

  return (
    <CMSEmpty
      title="No workflows exist"
      button={{ label: 'Create workflow', onClick: (search) => onCreate({ name: search }) }}
      searchTitle="No workflows found"
      description="Workflows are user-friendly tools, and scalable models, enhancing effectiveness in AI development "
      illustration="NoContent"
      learnMoreLink={CMS_WORKFLOW_LEARN_MORE}
    >
      <Table
        config={CMS_WORKFLOW_TABLE_CONFIG}
        itemsAtom={cmsManager.dataToRender}
        onRowClick={onRowClick}
        onRowNavigate={onRowNavigate}
        rowContextMenu={rowContextMenu}
        columnsOrderAtom={workflowColumnsOrderAtom}
      />
    </CMSEmpty>
  );
};

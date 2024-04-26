import { Table, Text, usePersistFunction } from '@voiceflow/ui-next';
import React from 'react';

import { CMS_WORKFLOW_LEARN_MORE } from '@/constants/link.constant';
import { Designer, Router } from '@/ducks';
import { useDispatch, useGetValueSelector } from '@/hooks/store.hook';

import { CMSEmpty } from '../../../../components/CMSEmpty/CMSEmpty.component';
import {
  useCMSRowItemClick,
  useCMSRowItemContextMenu,
  useCMSRowItemNavigate,
} from '../../../../hooks/cms-row-item.hook';
import { useOnWorkflowCreate, useWorkflowCMSManager } from '../../CMSWorkflow.hook';
import { workflowColumnsOrderAtom } from './CMSWorkflowTable.atom';
import { CMS_WORKFLOW_TABLE_CONFIG } from './CMSWorkflowTable.config';
import { WorkflowTableColumn } from './CMSWorkflowTable.constant';

export const CMSWorkflowTable: React.FC = () => {
  const onCreate = useOnWorkflowCreate();
  const onRowClick = useCMSRowItemClick();
  const cmsManager = useWorkflowCMSManager();
  const onRowNavigate = useCMSRowItemNavigate();

  const goToDiagram = useDispatch(Router.goToDiagram);
  const duplicateOne = useDispatch(Designer.Workflow.effect.duplicateOne);

  const getOneByID = useGetValueSelector(Designer.Workflow.selectors.oneByID);

  const rowContextMenu = useCMSRowItemContextMenu({
    nameColumnType: WorkflowTableColumn.NAME,
    onDuplicate: duplicateOne,

    canDelete: (resourceID) => {
      const workflow = getOneByID({ id: resourceID });

      if (!workflow?.isStart) return true;

      return {
        allowed: false,
        tooltip: {
          placement: 'left',
          children: () => <Text variant="caption">Start workflow can’t be deleted</Text>,
        },
      };
    },
  });

  const onRowDoubleClick = usePersistFunction((id: string) => {
    const workflow = getOneByID({ id });

    if (workflow) {
      goToDiagram(workflow.id);
    }
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
        onRowDoubleClick={onRowDoubleClick}
        columnsOrderAtom={workflowColumnsOrderAtom}
      />
    </CMSEmpty>
  );
};

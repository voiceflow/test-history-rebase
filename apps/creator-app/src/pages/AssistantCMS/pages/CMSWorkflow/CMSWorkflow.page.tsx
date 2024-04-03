import { Utils } from '@voiceflow/common';
import { FolderScope } from '@voiceflow/dtos';
import React from 'react';

import { Path } from '@/config/routes';
import { Designer } from '@/ducks';
import { Modals } from '@/ModalsV2';

import { withCMSManagerProvider } from '../../contexts/CMSManager';
import { withCMSRouteFolders } from '../../contexts/CMSRouteFolders';
import { withCMSInitialTableState } from '../../hocs/CMSInitialTableState.hoc';
import { withCMSResourceEditor } from '../../hocs/CMSResourceEditor.hoc';
import { withCMSResourceModals } from '../../hocs/CMSResourceModals.hoc';
import { workflowSearch } from './CMSWorkflow.util';
import { CMSWorkflowEditor } from './components/CMSWorkflowEditor/CMSWorkflowEditor.component';
import { CMSWorkflowHeader } from './components/CMSWorkflowHeader/CMSWorkflowHeader.component';
import { CMSWorkflowTable } from './components/CMSWorkflowTable/CMSWorkflowTable.component';
import { WorkflowTableColumn } from './components/CMSWorkflowTable/CMSWorkflowTable.constant';
import { CMSWorkflowTableNavigation } from './components/CMSWorkflowTableNavigation/CMSWorkflowTableNavigation.component';

const CMSWorkflow: React.FC = () => (
  <>
    <CMSWorkflowHeader />

    <CMSWorkflowTableNavigation />

    <CMSWorkflowTable />
  </>
);

export default Utils.functional.compose(
  withCMSRouteFolders({
    pathname: Path.CMS_WORKFLOW,
    folderScope: FolderScope.WORKFLOW,
  }),

  withCMSInitialTableState({
    orderBy: WorkflowTableColumn.NAME,
  }),

  withCMSManagerProvider({
    search: workflowSearch,

    effects: {
      patchOne: Designer.Workflow.effect.patchOne,
      patchMany: Designer.Workflow.effect.patchMany,
      deleteOne: Designer.Workflow.effect.deleteOne,
      deleteMany: Designer.Workflow.effect.deleteMany,
    },

    selectors: {
      oneByID: Designer.Workflow.selectors.oneByID,
      allByFolderID: Designer.Workflow.selectors.allByFolderID,
      allByFolderIDs: Designer.Workflow.selectors.allByFolderIDs,
    },
  }),

  withCMSResourceEditor({
    Editor: CMSWorkflowEditor,
  }),

  withCMSResourceModals([Modals.Flow.Create, ({ result, history, cmsResourceGetPath }) => history.push(cmsResourceGetPath(result.id).path)])
)(CMSWorkflow);

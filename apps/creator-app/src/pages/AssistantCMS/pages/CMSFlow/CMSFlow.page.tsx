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
import { flowSearch } from './CMSFlow.util';
import { CMSFlowEditor } from './components/CMSFlowEditor/CMSFlowEditor.component';
import { CMSFlowHeader } from './components/CMSFlowHeader/CMSFlowHeader.component';
import { CMSFlowTable } from './components/CMSFlowTable/CMSFlowTable.component';
import { FlowTableColumn } from './components/CMSFlowTable/CMSFlowTable.constant';
import { CMSFlowTableNavigation } from './components/CMSFlowTableNavigation/CMSFlowTableNavigation.component';

const CMSFlow: React.FC = () => (
  <>
    <CMSFlowHeader />

    <CMSFlowTableNavigation />

    <CMSFlowTable />
  </>
);

export default Utils.functional.compose(
  withCMSRouteFolders({
    pathname: Path.CMS_FLOW,
    folderScope: FolderScope.FLOW,
  }),

  withCMSInitialTableState({
    orderBy: FlowTableColumn.NAME,
  }),

  withCMSManagerProvider({
    search: flowSearch,

    effects: {
      patchOne: Designer.Flow.effect.patchOne,
      patchMany: Designer.Flow.effect.patchMany,
      deleteOne: Designer.Flow.effect.deleteOne,
      deleteMany: Designer.Flow.effect.deleteMany,
    },

    selectors: {
      oneByID: Designer.Flow.selectors.oneByID,
      allByFolderID: Designer.Flow.selectors.allByFolderID,
      allByFolderIDs: Designer.Flow.selectors.allByFolderIDs,
    },
  }),

  withCMSResourceEditor({
    Editor: CMSFlowEditor,
  }),

  withCMSResourceModals([
    Modals.Flow.Create,
    ({ result, history, cmsResourceGetPath }) => history.push(cmsResourceGetPath(result.id).path),
  ])
)(CMSFlow);

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
    countSelector: Designer.Flow.selectors.countByFolderID,
  }),

  withCMSInitialTableState({
    orderBy: FlowTableColumn.NAME,
  }),

  withCMSManagerProvider({
    search: flowSearch,
    pathname: Path.CMS_FLOW,
    folderScope: FolderScope.FLOW,

    effects: {
      patchOne: Designer.Flow.effect.patchOne,
      deleteOne: Designer.Flow.effect.deleteOne,
      deleteMany: Designer.Flow.effect.deleteMany,
    },

    selectors: {
      oneByID: Designer.Flow.selectors.oneByID,
      allByFolderID: Designer.Flow.selectors.allByFolderID,
    },
  }),

  withCMSResourceEditor({
    Editor: CMSFlowEditor,
  }),

  withCMSResourceModals([Modals.Flow.Create, ({ result, history, getCMSResourcePath }) => history.push(getCMSResourcePath(result.id).path)])
)(CMSFlow);

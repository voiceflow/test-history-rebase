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
import { functionSearch } from './CMSFunction.util';
import { CMSFunctionEditor } from './components/CMSFunctionEditor/CMSFunctionEditor.component';
import { CMSFunctionHeader } from './components/CMSFunctionHeader/CMSFunctionHeader.component';
import { CMSFunctionTable } from './components/CMSFunctionTable/CMSFunctionTable.component';
import { FunctionTableColumn } from './components/CMSFunctionTable/CMSFunctionTable.constant';
import { CMSFunctionTableNavigation } from './components/CMSFunctionTableNavigation/CMSFunctionTableNavigation.component';

const CMSFunction: React.FC = () => (
  <>
    <CMSFunctionHeader />

    <CMSFunctionTableNavigation />

    <CMSFunctionTable />
  </>
);

export default Utils.functional.compose(
  withCMSRouteFolders({
    pathname: Path.CMS_FUNCTION,
    folderScope: FolderScope.FUNCTION,
  }),

  withCMSInitialTableState({
    orderBy: FunctionTableColumn.NAME,
  }),

  withCMSManagerProvider({
    search: functionSearch,

    effects: {
      patchOne: Designer.Function.effect.patchOne,
      patchMany: Designer.Function.effect.patchMany,
      deleteOne: Designer.Function.effect.deleteOne,
      deleteMany: Designer.Function.effect.deleteMany,
      exportMany: Designer.Function.effect.exportMany,
    },

    selectors: {
      oneByID: Designer.Function.selectors.oneByID,
      allByFolderID: Designer.Function.selectors.allByFolderID,
      allByFolderIDs: Designer.Function.selectors.allByFolderIDs,
    },
  }),

  withCMSResourceEditor({
    Editor: CMSFunctionEditor,
  }),

  withCMSResourceModals([Modals.Function.Create, ({ result, history, cmsResourceGetPath }) => history.push(cmsResourceGetPath(result.id).path)])
)(CMSFunction);

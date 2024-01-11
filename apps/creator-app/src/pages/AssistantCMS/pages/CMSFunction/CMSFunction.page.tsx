import { Utils } from '@voiceflow/common';
import { FolderScope } from '@voiceflow/dtos';
import React from 'react';

import { Path } from '@/config/routes';
import { Designer } from '@/ducks';
import * as ModalsV2 from '@/ModalsV2';

import { withCMSManagerProvider } from '../../contexts/CMSManager';
import { withCMSRouteFolders } from '../../contexts/CMSRouteFolders';
import { withCMSInitialTableState } from '../../hocs/CMSInitialTableState.hoc';
import { withCMSResourceEditor } from '../../hocs/CMSResourceEditor.hoc';
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
    countSelector: Designer.Function.selectors.countByFolderID,
  }),

  withCMSInitialTableState({
    orderBy: FunctionTableColumn.NAME,
  }),

  withCMSManagerProvider({
    search: functionSearch,
    pathname: Path.CMS_FUNCTION,
    folderScope: FolderScope.FUNCTION,

    effects: {
      patchOne: Designer.Function.effect.patchOne,
      deleteOne: Designer.Function.effect.deleteOne,
      deleteMany: Designer.Function.effect.deleteMany,
      exportMany: Designer.Function.effect.exportMany,
    },

    selectors: {
      oneByID: Designer.Function.selectors.oneByID,
      allByFolderID: Designer.Function.selectors.allByFolderID,
    },
  }),

  withCMSResourceEditor({
    Editor: CMSFunctionEditor,
    modals: {
      [ModalsV2.Function.CreateModalID]: ModalsV2.Function.Create,
    },
  })
)(CMSFunction);

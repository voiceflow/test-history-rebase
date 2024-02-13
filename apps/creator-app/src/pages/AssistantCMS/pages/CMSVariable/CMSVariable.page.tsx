import { Utils } from '@voiceflow/common';
import { FolderScope } from '@voiceflow/dtos';
import React from 'react';

import { Path } from '@/config/routes';
import { Designer } from '@/ducks';

import { withCMSManagerProvider } from '../../contexts/CMSManager';
import { withCMSRouteFolders } from '../../contexts/CMSRouteFolders';
import { withCMSInitialTableState } from '../../hocs/CMSInitialTableState.hoc';
import { withCMSResourceEditor } from '../../hocs/CMSResourceEditor.hoc';
import { variableSearch } from './CMSVariable.util';
import { CMSVariableEditor } from './components/CMSVariableEditor/CMSVariableEditor.component';
import { CMSVariableHeader } from './components/CMSVariableHeader/CMSVariableHeader.component';
import { CMSVariableTable } from './components/CMSVariableTable/CMSVariableTable.component';
import { VariableTableColumn } from './components/CMSVariableTable/CMSVariableTable.constant';
import { CMSVariableTableNavigation } from './components/CMSVariableTableNavigation/CMSVariableTableNavigation.component';

const CMSVariable: React.FC = () => (
  <>
    <CMSVariableHeader />

    <CMSVariableTableNavigation />

    <CMSVariableTable />
  </>
);

export default Utils.functional.compose(
  withCMSRouteFolders({
    pathname: Path.CMS_VARIABLE,
    folderScope: FolderScope.VARIABLE,
  }),

  withCMSInitialTableState({
    orderBy: VariableTableColumn.NAME,
  }),

  withCMSManagerProvider({
    search: variableSearch,

    effects: {
      patchOne: Designer.Variable.effect.patchOne,
      patchMany: Designer.Variable.effect.patchMany,
      deleteOne: Designer.Variable.effect.deleteOne,
      deleteMany: Designer.Variable.effect.deleteMany,
    },

    selectors: {
      oneByID: Designer.Variable.selectors.oneByID,
      allByFolderID: Designer.Variable.selectors.allByFolderID,
      allByFolderIDs: Designer.Variable.selectors.allByFolderIDs,
    },
  }),

  withCMSResourceEditor({
    Editor: CMSVariableEditor,
  })
)(CMSVariable);

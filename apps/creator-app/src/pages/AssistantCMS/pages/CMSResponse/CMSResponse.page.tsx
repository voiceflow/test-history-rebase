import { Utils } from '@voiceflow/common';
import { FolderScope } from '@voiceflow/dtos';
import React from 'react';

import { Path } from '@/config/routes';
import { Designer } from '@/ducks';

import { withCMSManagerProvider } from '../../contexts/CMSManager';
import { withCMSRouteFolders } from '../../contexts/CMSRouteFolders';
import { withCMSInitialTableState } from '../../hocs/CMSInitialTableState.hoc';
import { withCMSResourceEditor } from '../../hocs/CMSResourceEditor.hoc';
import { cmsResponseSortContextAtom } from './CMSResponse.atom';
import { responseSearch } from './CMSResponse.util';
import { CMSResponseEditor } from './components/CMSResponseEditor/CMSResponseEditor.component';
import { CMSResponseHeader } from './components/CMSResponseHeader/CMSResponseHeader.component';
import { CMSResponseTable } from './components/CMSResponseTable/CMSResponseTable.component';
import { ResponseTableColumn } from './components/CMSResponseTable/CMSResponseTable.constant';
import { CMSResponseTableNavigation } from './components/CMSResponseTableNavigation/CMSResponseTableNavigation.component';

const CMSResponse: React.FC = () => (
  <>
    <CMSResponseHeader />

    <CMSResponseTableNavigation />

    <CMSResponseTable />
  </>
);

export default Utils.functional.compose(
  withCMSRouteFolders({
    pathname: Path.CMS_RESPONSE,
    folderScope: FolderScope.RESPONSE,
  }),

  withCMSInitialTableState({
    orderBy: ResponseTableColumn.ALL,
  }),

  withCMSManagerProvider({
    search: responseSearch,
    searchContext: cmsResponseSortContextAtom,

    effects: {
      patchOne: Designer.Response.effect.patchOne,
      patchMany: Designer.Response.effect.patchMany,
      deleteOne: Designer.Response.effect.deleteOne,
      deleteMany: Designer.Response.effect.deleteMany,
    },

    selectors: {
      oneByID: Designer.Response.selectors.oneByID,
      allByFolderID: Designer.Response.selectors.allByFolderID,
      allByFolderIDs: Designer.Response.selectors.allByFolderIDs,
    },
  }),

  withCMSResourceEditor({
    Editor: CMSResponseEditor,
  })
)(CMSResponse);

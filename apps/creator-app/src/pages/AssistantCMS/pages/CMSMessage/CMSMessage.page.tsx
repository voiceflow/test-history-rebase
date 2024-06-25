import { Utils } from '@voiceflow/common';
import { FolderScope, ResponseType } from '@voiceflow/dtos';
import React from 'react';

import { Path } from '@/config/routes';
import { Designer } from '@/ducks';

import { withCMSManagerProvider } from '../../contexts/CMSManager';
import { withCMSRouteFolders } from '../../contexts/CMSRouteFolders';
import { withCMSInitialTableState } from '../../hocs/CMSInitialTableState.hoc';
import { withCMSResourceEditor } from '../../hocs/CMSResourceEditor.hoc';
import { cmsResponseSortContextAtom } from './CMSMessage.atom';
import { responseSearch } from './CMSMessage.util';
import { CMSMessageEditor } from './components/CMSMessageEditor/CMSMessageEditor.component';
import { CMSMessageHeader } from './components/CMSMessageHeader/CMSMessageHeader.component';
import { CMSMessageTable } from './components/CMSMessageTable/CMSMessageTable.component';
import { ResponseTableColumn } from './components/CMSMessageTable/CMSMessageTable.constant';
import { CMSMessageTableNavigation } from './components/CMSMessageTableNavigation/CMSMessageTableNavigation.component';

const CMSMessage: React.FC = () => (
  <>
    <CMSMessageHeader />

    <CMSMessageTableNavigation />

    <CMSMessageTable />
  </>
);

export default Utils.functional.compose(
  withCMSRouteFolders({
    pathname: Path.CMS_MESSAGE,
    folderScope: FolderScope.MESSAGE,
  }),

  withCMSInitialTableState({
    orderBy: ResponseTableColumn.ALL,
  }),

  withCMSManagerProvider({
    search: responseSearch,
    searchContext: cmsResponseSortContextAtom,

    effects: {
      patchOne: Designer.Response.effect.patchOne as any,
      patchMany: Designer.Response.effect.patchMany as any,
      deleteOne: Designer.Response.effect.deleteOne,
      deleteMany: Designer.Response.effect.deleteMany,
    },

    selectors: {
      oneByID: Designer.Response.selectors.oneByID,
      allByFolderID: Designer.Response.selectors.allByFolderIDAndType(ResponseType.MESSAGE),
      allByFolderIDs: Designer.Response.selectors.allByFolderIDsAndType(ResponseType.MESSAGE),
    },
  }),

  withCMSResourceEditor({
    Editor: CMSMessageEditor,
  })
)(CMSMessage);

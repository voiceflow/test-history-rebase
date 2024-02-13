import { Utils } from '@voiceflow/common';
import { FolderScope } from '@voiceflow/dtos';
import React from 'react';

import { Path } from '@/config/routes';
import { Designer } from '@/ducks';

import { withCMSManagerProvider } from '../../contexts/CMSManager';
import { withCMSRouteFolders } from '../../contexts/CMSRouteFolders';
import { withCMSInitialTableState } from '../../hocs/CMSInitialTableState.hoc';
import { withCMSResourceEditor } from '../../hocs/CMSResourceEditor.hoc';
import { cmsIntentSortContextAtom } from './CMSIntent.atom';
import { intentSearch } from './CMSIntent.util';
import { CMSIntentEditor } from './components/CMSIntentEditor/CMSIntentEditor.component';
import { CMSIntentHeader } from './components/CMSIntentHeader/CMSIntentHeader.component';
import { CMSIntentTable } from './components/CMSIntentTable/CMSIntentTable.component';
import { IntentTableColumn } from './components/CMSIntentTable/CMSIntentTable.constant';
import { CMSIntentTableNavigation } from './components/CMSIntentTableNavigation/CMSIntentTableNavigation.component';

const CMSIntent: React.FC = () => (
  <>
    <CMSIntentHeader />

    <CMSIntentTableNavigation />

    <CMSIntentTable />
  </>
);

export default Utils.functional.compose(
  withCMSRouteFolders({
    pathname: Path.CMS_INTENT,
    folderScope: FolderScope.INTENT,
  }),

  withCMSInitialTableState({
    orderBy: IntentTableColumn.NAME,
    sortContext: cmsIntentSortContextAtom,
  }),

  withCMSManagerProvider({
    search: intentSearch,

    effects: {
      patchOne: Designer.Intent.effect.patchOne,
      patchMany: Designer.Intent.effect.patchMany,
      deleteOne: Designer.Intent.effect.deleteOne,
      deleteMany: Designer.Intent.effect.deleteMany,
    },

    selectors: {
      oneByID: Designer.Intent.selectors.oneWithFormattedBuiltNameByID,
      allByFolderID: Designer.Intent.selectors.allByFolderID,
      allByFolderIDs: Designer.Intent.selectors.allByFolderIDs,
    },
  }),

  withCMSResourceEditor({
    Editor: CMSIntentEditor,
  })
)(CMSIntent);

import { Utils } from '@voiceflow/common';
import { FolderScope } from '@voiceflow/dtos';
import React from 'react';

import { Path } from '@/config/routes';
import { Designer } from '@/ducks';

import { withCMSManagerProvider } from '../../contexts/CMSManager';
import { withCMSRouteFolders } from '../../contexts/CMSRouteFolders';
import { withCMSInitialTableState } from '../../hocs/CMSInitialTableState.hoc';
import { withCMSResourceEditor } from '../../hocs/CMSResourceEditor.hoc';
import { componentSearch } from './CMSComponent.util';
import { CMSComponentEditor } from './components/CMSComponentEditor/CMSComponentEditor.component';
import { CMSComponentHeader } from './components/CMSComponentHeader/CMSComponentHeader.component';
import { CMSComponentTable } from './components/CMSComponentTable/CMSComponentTable.component';
import { ComponentTableColumn } from './components/CMSComponentTable/CMSComponentTable.constant';
import { CMSComponentTableNavigation } from './components/CMSComponentTableNavigation/CMSComponentTableNavigation.component';

const CMSComponent: React.FC = () => (
  <>
    <CMSComponentHeader />

    <CMSComponentTableNavigation />

    <CMSComponentTable />
  </>
);

export default Utils.functional.compose(
  withCMSRouteFolders({
    countSelector: Designer.Flow.selectors.countByFolderID,
  }),

  withCMSInitialTableState({
    orderBy: ComponentTableColumn.NAME,
  }),

  withCMSManagerProvider({
    search: componentSearch,
    pathname: Path.CMS_COMPONENT,
    folderScope: FolderScope.COMPONENT,

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
    Editor: CMSComponentEditor,
  })
)(CMSComponent);

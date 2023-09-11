import { Utils } from '@voiceflow/common';
import { FolderScope } from '@voiceflow/sdk-logux-designer';
import React from 'react';

import { Path } from '@/config/routes';
import { Designer } from '@/ducks';

import { withCMSManagerProvider } from '../../contexts/CMSManager';
import { withCMSRouteFolders } from '../../contexts/CMSRouteFolders';
import { withCMSInitialTableState } from '../../hocs/CMSInitialTableState.hoc';
import { withCMSResourceEditor } from '../../hocs/CMSResourceEditor.hoc';
import { entitySearch } from './CMSEntity.util';
import { CMSEntityEditor } from './components/CMSEntityEditor/CMSEntityEditor.component';
import { CMSEntityHeader } from './components/CMSEntityHeader/CMSEntityHeader.component';
import { CMSEntityTable } from './components/CMSEntityTable/CMSEntityTable.component';
import { EntityTableColumn } from './components/CMSEntityTable/CMSEntityTable.constant';
import { CMSEntityTableNavigation } from './components/CMSEntityTableNavigation/CMSEntityTableNavigation.component';

const CMSEntity: React.FC = () => (
  <>
    <CMSEntityHeader />

    <CMSEntityTableNavigation />

    <CMSEntityTable />
  </>
);

export default Utils.functional.compose(
  withCMSRouteFolders({
    countSelector: Designer.Entity.selectors.countByFolderID,
  }),

  withCMSInitialTableState({
    orderBy: EntityTableColumn.NAME,
  }),

  withCMSManagerProvider({
    search: entitySearch,
    pathname: Path.CMS_ENTITY,
    folderScope: FolderScope.ENTITY,

    effects: {
      patchOne: Designer.Entity.effect.patchOne,
      deleteOne: Designer.Entity.effect.deleteOne,
      deleteMany: Designer.Entity.effect.deleteMany,
    },

    selectors: {
      oneByID: Designer.Entity.selectors.oneByID,
      allByFolderID: Designer.Entity.selectors.allByFolderID,
    },
  }),

  withCMSResourceEditor({
    Editor: CMSEntityEditor,
  })
)(CMSEntity);

import { Utils } from '@voiceflow/common';
import { FolderScope } from '@voiceflow/dtos';
import React from 'react';

import { Path } from '@/config/routes';
import { Designer } from '@/ducks';

import { withCMSManagerProvider } from '../../contexts/CMSManager';
import { withCMSRouteFolders } from '../../contexts/CMSRouteFolders';
import { withCMSInitialTableState } from '../../hocs/CMSInitialTableState.hoc';
import { withCMSPageLoader } from '../../hocs/CMSPageLoader.hoc';
import { withCMSResourceEditor } from '../../hocs/CMSResourceEditor.hoc';
import { knowledgeBaseSearch } from './CMSKnowledgeBase.util';
import { CMSKnowledgeBaseEditor } from './components/CMSKnowledgeBaseEditor/CMSKnowledgeBaseEditor.component';
import { CMSKnowledgeBaseHeader } from './components/CMSKnowledgeBaseHeader/CMSKnowledgeBaseHeader.component';
import { CMSKnowledgeBaseTable } from './components/CMSKnowledgeBaseTable/CMSKnowledgeBaseTable.component';
import { KnowledgeBaseTableColumn } from './components/CMSKnowledgeBaseTable/CMSKnowledgeBaseTable.constant';
import { CMSKnowledgeBaseTableNavigation } from './components/CMSKnowledgeBaseTableNavigation/CMSKnowledgeBaseTableNavigation.component';

const CMSKnowledgeBase: React.FC = () => {
  return (
    <>
      <CMSKnowledgeBaseHeader />

      <CMSKnowledgeBaseTableNavigation />

      <CMSKnowledgeBaseTable />
    </>
  );
};

export default Utils.functional.compose(
  withCMSPageLoader({
    selector: Designer.KnowledgeBase.Document.selectors.isLoaded,
  }),

  withCMSRouteFolders({
    pathname: Path.CMS_KNOWLEDGE_BASE,
    folderScope: FolderScope.KNOWLEDGE_BASE,
  }),

  withCMSInitialTableState({
    orderBy: KnowledgeBaseTableColumn.DATE,
  }),

  withCMSManagerProvider({
    search: knowledgeBaseSearch,

    effects: {
      patchOne: Designer.KnowledgeBase.Document.effect.patchOne,
      patchMany: Designer.KnowledgeBase.Document.effect.patchMany,
      deleteOne: Designer.KnowledgeBase.Document.effect.deleteOne,
      deleteMany: Designer.KnowledgeBase.Document.effect.deleteMany,
    },

    selectors: {
      oneByID: Designer.KnowledgeBase.Document.selectors.oneByID,
      // TODO: use allByFolderID selector when it's available
      allByFolderID: Designer.KnowledgeBase.Document.selectors.all,
      allByFolderIDs: Designer.KnowledgeBase.Document.selectors.all,
    },
  }),

  withCMSResourceEditor({
    Editor: CMSKnowledgeBaseEditor,
  })
)(CMSKnowledgeBase);

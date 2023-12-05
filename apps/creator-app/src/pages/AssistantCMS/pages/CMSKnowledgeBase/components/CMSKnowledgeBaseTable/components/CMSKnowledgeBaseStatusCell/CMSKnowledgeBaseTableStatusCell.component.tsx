import { BaseModels } from '@voiceflow/base-types';
import React from 'react';

import { KnowledgeBaseTableItem } from '@/pages/AssistantCMS/contexts/CMSKnowledgeBase.context';

import { DocumentStatusError } from './components/DocumentStatusError.component';
import { DocumentStatusLoading } from './components/DocumentStatusLoading.component';
import { DocumentStatusSuccess } from './components/DocumentStatusSuccess.component';

const CellComponents: Record<BaseModels.Project.KnowledgeBaseDocumentStatus, (item: KnowledgeBaseTableItem) => React.ReactElement> = {
  [BaseModels.Project.KnowledgeBaseDocumentStatus.SUCCESS]: () => <DocumentStatusSuccess />,
  [BaseModels.Project.KnowledgeBaseDocumentStatus.ERROR]: (item) => <DocumentStatusError item={item} />,
  [BaseModels.Project.KnowledgeBaseDocumentStatus.PENDING]: () => <DocumentStatusLoading />,
  [BaseModels.Project.KnowledgeBaseDocumentStatus.INITIALIZED]: () => <DocumentStatusLoading />,
};

export const Status: React.FC<{ item: KnowledgeBaseTableItem }> = ({ item }) => {
  return CellComponents[item.status.type](item);
};

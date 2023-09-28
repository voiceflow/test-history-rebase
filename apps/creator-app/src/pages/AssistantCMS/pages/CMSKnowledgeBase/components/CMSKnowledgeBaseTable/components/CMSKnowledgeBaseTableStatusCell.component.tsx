import { BaseModels } from '@voiceflow/base-types';
import { Icon } from '@voiceflow/ui-next';
import React from 'react';

import { KnowledgeBaseTableItem } from '@/pages/KnowledgeBase/context';

import { DocumentStatusError } from './DocumentStatusError.component';
import { DocumentStatusSuccess } from './DocumentStatusSuccess.component';

const CellComponents: Record<BaseModels.Project.KnowledgeBaseDocumentStatus, (item: KnowledgeBaseTableItem) => React.ReactElement> = {
  [BaseModels.Project.KnowledgeBaseDocumentStatus.SUCCESS]: () => <DocumentStatusSuccess />,
  [BaseModels.Project.KnowledgeBaseDocumentStatus.ERROR]: (item) => <DocumentStatusError item={item} />,
  [BaseModels.Project.KnowledgeBaseDocumentStatus.PENDING]: () => <Icon name="Sync" />,
  [BaseModels.Project.KnowledgeBaseDocumentStatus.INITIALIZED]: () => <Icon name="Sync" />,
};

export const Status: React.FC<{ item: KnowledgeBaseTableItem }> = ({ item }) => {
  return CellComponents[item.status.type](item);
};

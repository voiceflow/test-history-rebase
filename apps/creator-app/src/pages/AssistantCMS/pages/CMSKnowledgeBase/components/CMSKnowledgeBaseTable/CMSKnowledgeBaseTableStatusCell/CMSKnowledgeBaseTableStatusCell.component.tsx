import { BaseModels } from '@voiceflow/base-types';
import React from 'react';

import type { ICMSKnowledgeBaseTableStatusCell } from './CMSKnowledgeBaseTableStatusCell.interface';
import { DocumentStatusError } from './DocumentStatusError.component';
import { DocumentStatusLoading } from './DocumentStatusLoading.component';
import { DocumentStatusSuccess } from './DocumentStatusSuccess.component';

export const Status: React.FC<ICMSKnowledgeBaseTableStatusCell> = ({ item }) => {
  switch (item.status) {
    case BaseModels.Project.KnowledgeBaseDocumentStatus.SUCCESS:
      return <DocumentStatusSuccess item={item} />;
    case BaseModels.Project.KnowledgeBaseDocumentStatus.ERROR:
      return <DocumentStatusError item={item} />;
    case BaseModels.Project.KnowledgeBaseDocumentStatus.PENDING:
    case BaseModels.Project.KnowledgeBaseDocumentStatus.INITIALIZED:
      return <DocumentStatusLoading item={item} />;
    default:
      return null;
  }
};

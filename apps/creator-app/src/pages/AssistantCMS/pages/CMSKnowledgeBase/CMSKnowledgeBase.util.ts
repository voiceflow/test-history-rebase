import { BaseModels } from '@voiceflow/base-types';

import * as Tracking from '@/ducks/tracking';

import type { CMSKnowledgeBase } from '../../contexts/CMSManager/CMSManager.interface';
import { localeCompareSort, withFolderSearch, withOptionalSort } from '../../contexts/CMSManager/CMSManager.util';

export const knowledgeBaseSearch = withFolderSearch<CMSKnowledgeBase>((item, { search }) => {
  Tracking.trackAiKnowledgeBaseSearch({ SearchTerm: search });
  return !!item.data?.name.toLocaleLowerCase().includes(search);
});

export const sortByName = (left: CMSKnowledgeBase, right: CMSKnowledgeBase) =>
  withOptionalSort(localeCompareSort)(left.data?.name, right.data?.name);

const statusSort = (
  left: BaseModels.Project.KnowledgeBaseDocumentStatus,
  right: BaseModels.Project.KnowledgeBaseDocumentStatus
) => {
  if (left === right) return 0;

  if (left === BaseModels.Project.KnowledgeBaseDocumentStatus.ERROR) {
    return -1;
  }

  if (left === BaseModels.Project.KnowledgeBaseDocumentStatus.SUCCESS) {
    return 1;
  }

  if (right === BaseModels.Project.KnowledgeBaseDocumentStatus.SUCCESS) {
    return -1;
  }

  if (right === BaseModels.Project.KnowledgeBaseDocumentStatus.ERROR) {
    return 1;
  }

  return 0;
};

export const sortByStatus = (left: CMSKnowledgeBase, right: CMSKnowledgeBase) =>
  withOptionalSort(statusSort)(left.status, right.status);

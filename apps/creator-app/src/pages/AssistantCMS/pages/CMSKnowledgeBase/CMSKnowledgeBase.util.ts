import type { CMSKnowledgeBase } from '@/pages/AssistantCMS/contexts/CMSManager/CMSManager.interface';

export const sortByName = (left: CMSKnowledgeBase, right: CMSKnowledgeBase) =>
  right.data.name.toLocaleLowerCase().localeCompare(left.data.name.toLocaleLowerCase());

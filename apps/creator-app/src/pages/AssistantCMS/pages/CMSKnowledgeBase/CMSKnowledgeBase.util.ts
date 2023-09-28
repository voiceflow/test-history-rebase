import { type TableSorterOptions } from '@voiceflow/ui-next';

import type { CMSKnowledgeBase } from '@/pages/AssistantCMS/contexts/CMSManager/CMSManager.interface';

const withGroupsOrder =
  (orderItems: (left: CMSKnowledgeBase, right: CMSKnowledgeBase) => number) =>
  (left: CMSKnowledgeBase, right: CMSKnowledgeBase, options: TableSorterOptions) => {
    if (left.group && right.group) return right.data.name.localeCompare(left.data.name);
    if (left.group || right.group) return (left.group ? 1 : -1) * (options.descending ? 1 : -1);

    return orderItems(left, right);
  };

export const sortByName = withGroupsOrder((left, right) => right.data.name.localeCompare(left.data.name));

export const sortByDate = withGroupsOrder((left, right) => new Date(left.updatedAt).getTime() - new Date(right.updatedAt).getTime());

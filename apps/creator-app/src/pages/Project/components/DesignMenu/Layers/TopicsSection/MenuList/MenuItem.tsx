import { BaseModels } from '@voiceflow/base-types';
import type { Nullable } from '@voiceflow/common';
import React from 'react';

import type { DragPreviewComponentProps, ItemComponentProps } from '@/components/DraggableList';

import type { TopicMenuItem } from '../hooks';
import type TopicItem from '../TopicItem';
import NodeItem from './NodeItem';

interface MenuItemProps extends ItemComponentProps<TopicMenuItem>, DragPreviewComponentProps {
  isSearch: boolean;
  diagramID: string;
  isSubtopic?: boolean;
  TopicItem: typeof TopicItem;
  onAddIntent: (topicID: string) => void;
  openedTopics: Record<string, boolean>;
  onToggleOpen: (topicID: string) => void;
  disableHover?: boolean;
  rootDiagramID: Nullable<string>;
  focusedNodeID: Nullable<string>;
  activeDiagramID: Nullable<string>;
  onCreateSubtopic: (rootTopicID: string) => void;
  searchMatchValue: string;
  onSubtopicDragEnd: VoidFunction;
  lastCreatedDiagramID: Nullable<string>;
  onSubtopicDragStart: (idsToClose: string[]) => void;
  onClearLastCreatedDiagramID: VoidFunction;
}

const MenuItem = React.forwardRef<HTMLElement, MenuItemProps>(({ item, isSubtopic, TopicItem, ...props }, ref) => {
  if (item.type === BaseModels.Diagram.MenuItemType.DIAGRAM) {
    return <TopicItem ref={ref} item={item} isSubtopic rootTopicID={props.diagramID} {...props} />;
  }

  if (item.type === BaseModels.Diagram.MenuItemType.NODE) {
    return <NodeItem ref={ref} item={item} isSubtopic={isSubtopic} {...props} />;
  }

  return null;
});

export default MenuItem;

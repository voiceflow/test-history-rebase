import { Nullable } from '@voiceflow/common';
import React from 'react';

import { DragPreviewComponentProps, ItemComponentProps } from '@/components/DraggableList';

import { TopicItem as TopicItemType } from '../hooks';
import MenuList from '../MenuList';
import TopicItemName from './Name';

interface TopicItemProps extends ItemComponentProps<TopicItemType>, DragPreviewComponentProps {
  isSearch: boolean;
  isSubtopic?: boolean;
  rootTopicID?: string;
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

const TopicItem = React.forwardRef<HTMLElement, TopicItemProps>(
  (
    {
      item: { name, topicID, menuItems },
      index,
      isSearch,
      isDragging,
      isSubtopic,
      onAddIntent,
      rootTopicID,
      onToggleOpen,
      openedTopics,
      isDragActive,
      rootDiagramID,
      focusedNodeID,
      activeDiagramID,
      searchMatchValue,
      onCreateSubtopic,
      isDraggingPreview,
      onSubtopicDragEnd,
      lastCreatedDiagramID,
      onSubtopicDragStart,
      onClearLastCreatedDiagramID,
    },
    ref
  ) => {
    const isRoot = topicID === rootDiagramID;
    const isOpened = openedTopics[topicID];

    return (
      <>
        <TopicItemName
          ref={ref}
          name={name}
          isFirst={index === 0}
          isOpened={isOpened}
          isActive={activeDiagramID === topicID}
          isSearch={isSearch}
          diagramID={topicID}
          isSubtopic={isSubtopic}
          isDragging={isDragging}
          rootTopicID={rootTopicID}
          onAddIntent={onAddIntent}
          onToggleOpen={onToggleOpen}
          disableHover={isDragActive}
          onCreateSubtopic={onCreateSubtopic}
          searchMatchValue={searchMatchValue}
          isDraggingPreview={isDraggingPreview}
          lastCreatedDiagramID={lastCreatedDiagramID}
          onClearLastCreatedDiagramID={onClearLastCreatedDiagramID}
        />

        {isOpened && !isDragging && !isDraggingPreview && (
          <MenuList
            isRoot={isRoot}
            isSearch={isSearch}
            TopicItem={TopicItem}
            menuItems={menuItems}
            diagramID={topicID}
            isSubtopic={isSubtopic}
            onAddIntent={onAddIntent}
            openedTopics={openedTopics}
            onToggleOpen={onToggleOpen}
            disableHover={isDragActive}
            rootDiagramID={rootDiagramID}
            focusedNodeID={focusedNodeID}
            activeDiagramID={activeDiagramID}
            searchMatchValue={searchMatchValue}
            onCreateSubtopic={onCreateSubtopic}
            onSubtopicDragEnd={onSubtopicDragEnd}
            lastCreatedDiagramID={lastCreatedDiagramID}
            onSubtopicDragStart={onSubtopicDragStart}
            onClearLastCreatedDiagramID={onClearLastCreatedDiagramID}
          />
        )}
      </>
    );
  }
);

export default TopicItem;

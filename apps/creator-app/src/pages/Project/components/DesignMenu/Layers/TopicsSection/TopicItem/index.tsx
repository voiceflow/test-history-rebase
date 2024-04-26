import React from 'react';

import { useDidUpdateEffect } from '@/hooks';

import type { TopicItemProps } from '../hooks';
import { useSubtopicDrop } from '../hooks';
import MenuList from '../MenuList';
import TopicItemName from './Name';

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

    const { ref: connectDrop, isSubtopicHovering } = useSubtopicDrop(topicID, isSubtopic);

    useDidUpdateEffect(() => {
      if (!isOpened && menuItems.some((item) => item.sourceID === focusedNodeID)) {
        onToggleOpen(topicID);
      }
    }, [focusedNodeID, menuItems, onToggleOpen, topicID]);

    return (
      <div ref={connectDrop}>
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
          subtopicDropPreview={isSubtopicHovering}
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
      </div>
    );
  }
);

export default TopicItem;

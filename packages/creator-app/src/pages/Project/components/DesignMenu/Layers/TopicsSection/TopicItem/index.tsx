import { Nullable } from '@voiceflow/common';
import React from 'react';

import { DragPreviewComponentProps, ItemComponentProps } from '@/components/DraggableList';

import { TopicItem as TopicItemModel } from '../hooks';
import MenuList from '../MenuList';
import TopicItemName from './Name';

interface TopicItemProps extends ItemComponentProps<TopicItemModel>, DragPreviewComponentProps {
  isSearch: boolean;
  openedTopics: Record<string, boolean>;
  onToggleOpen: (topicID: string) => void;
  disableHover?: boolean;
  rootDiagramID: Nullable<string>;
  focusedNodeID: Nullable<string>;
  activeDiagramID: Nullable<string>;
  searchMatchValue: string;
  lastCreatedDiagramID: Nullable<string>;
  onClearLastCreatedDiagramID: VoidFunction;
}

const TopicItem: React.ForwardRefRenderFunction<HTMLElement, TopicItemProps> = (
  {
    item: { id: diagramID, name, menuItems },
    index,
    isSearch,
    isDragging,
    onToggleOpen,
    openedTopics,
    isDragActive,
    rootDiagramID,
    focusedNodeID,
    activeDiagramID,
    searchMatchValue,
    isDraggingPreview,
    lastCreatedDiagramID,
    onClearLastCreatedDiagramID,
  },
  ref
) => {
  const isRoot = diagramID === rootDiagramID;
  const isOpened = openedTopics[diagramID];
  const isActive = activeDiagramID === diagramID;

  return (
    <>
      <TopicItemName
        ref={ref}
        name={name}
        isFirst={index === 0}
        isOpened={isOpened}
        isActive={isActive}
        isSearch={isSearch}
        diagramID={diagramID}
        isDragging={isDragging}
        onToggleOpen={onToggleOpen}
        disableHover={isDragActive}
        searchMatchValue={searchMatchValue}
        isDraggingPreview={isDraggingPreview}
        lastCreatedDiagramID={lastCreatedDiagramID}
        onClearLastCreatedDiagramID={onClearLastCreatedDiagramID}
      />

      {isOpened && !isDragging && !isDraggingPreview && (
        <MenuList
          isRoot={isRoot}
          isSearch={isSearch}
          isActive={isActive}
          diagramID={diagramID}
          menuItems={menuItems}
          focusedNodeID={focusedNodeID}
          searchMatchValue={searchMatchValue}
        />
      )}
    </>
  );
};

export default React.forwardRef<HTMLElement, TopicItemProps>(TopicItem);

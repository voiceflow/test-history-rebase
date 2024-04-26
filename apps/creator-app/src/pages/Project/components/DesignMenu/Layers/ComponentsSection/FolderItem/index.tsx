import type { Nullable } from '@voiceflow/common';
import React from 'react';

import type { DragPreviewComponentProps, ItemComponentProps } from '@/components/DraggableList';

import ComponentItemName from '../ComponentItemName';
import type { ComponentItem } from '../hooks';

export interface FolderItemProps extends ItemComponentProps<ComponentItem>, DragPreviewComponentProps {
  isSearch: boolean;
  activeDiagramID: Nullable<string>;
  searchMatchValue: string;
  lastCreatedDiagramID: Nullable<string>;
  onClearLastCreatedDiagramID: VoidFunction;
}

// TODO: folder items will be added here, similar to intents in the topics

const FolderItem: React.ForwardRefRenderFunction<HTMLElement, FolderItemProps> = (
  {
    item: { id: diagramID, name },
    isSearch,
    isDragging,
    isDragActive,
    activeDiagramID,
    searchMatchValue,
    isDraggingPreview,
    isDraggingXEnabled,
    lastCreatedDiagramID,
    onClearLastCreatedDiagramID,
  },
  ref
) => {
  const isActive = activeDiagramID === diagramID;

  return (
    <ComponentItemName
      ref={ref}
      icon="systemSymbolSmall"
      name={name}
      isActive={isActive}
      isSearch={isSearch}
      diagramID={diagramID}
      isDragging={isDragging}
      disableHover={isDragActive}
      searchMatchValue={searchMatchValue}
      isDraggingPreview={isDraggingPreview}
      isDraggingXEnabled={isDraggingXEnabled}
      lastCreatedDiagramID={lastCreatedDiagramID}
      onClearLastCreatedDiagramID={onClearLastCreatedDiagramID}
    />
  );
};

export default React.forwardRef<HTMLElement, FolderItemProps>(FolderItem);

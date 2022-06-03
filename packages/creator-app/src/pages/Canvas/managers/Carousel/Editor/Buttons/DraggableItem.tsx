import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { DragPreviewComponentProps, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import { NodeEditorV2Props } from '@/pages/Canvas/managers/types';
import { transformVariablesToReadable } from '@/utils/slot';

import { PATH } from './constants';

export interface CarouselEditorDraggableItemProps
  extends ItemComponentProps<Realtime.NodeData.Carousel.Button>,
    DragPreviewComponentProps,
    MappedItemComponentHandlers<Realtime.NodeData.Carousel.Button> {
  editor: NodeEditorV2Props<Realtime.NodeData.Carousel, Realtime.NodeData.CarouselBuiltInPorts>;
}

// eslint-disable-next-line xss/no-mixed-html
const CarouselEditorDraggableItem: React.ForwardRefRenderFunction<HTMLElement, CarouselEditorDraggableItemProps> = (
  { item: button, editor, onRemove, isDragging, connectedDragRef, isDraggingPreview },
  ref
) => (
  <div ref={ref as React.Ref<HTMLDivElement>}>
    <SectionV2.ListItem
      isDragging={isDragging}
      isDraggingPreview={isDraggingPreview}
      ref={connectedDragRef as React.Ref<HTMLDivElement>}
      icon="button"
      action={isDraggingPreview ? null : <SectionV2.RemoveButton onClick={!isDragging ? onRemove : undefined} />}
      onClick={() => editor.goToNested({ path: PATH, params: { buttonID: button.id } })}
    >
      {transformVariablesToReadable(button.name) || 'Button Label'}
    </SectionV2.ListItem>
  </div>
);

export default React.forwardRef(CarouselEditorDraggableItem);

import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import StepHandle from '@/containers/Designer/components/Step/components/StepHandle';
import { StepContext, StepManagerContext } from '@/containers/Designer/contexts';

const REORDERABLE_STEP = 'reorderableStep';

// eslint-disable-next-line import/prefer-default-export
export const useReorderable = (type, props) => {
  const stepManager = React.useContext(StepManagerContext);
  const step = React.useContext(StepContext);
  const rootRef = React.useRef(null);

  const [, connectDrop] = useDrop({
    accept: REORDERABLE_STEP,
    hover(item, monitor) {
      if (!rootRef.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = step.index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = rootRef.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      stepManager.reorder(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, connectDrag, connectPreview] = useDrag({
    item: {
      ...props,
      type: REORDERABLE_STEP,
      stepType: type,
      index: step && step.index,
      getRect: () => rootRef.current.getBoundingClientRect(),
    },
    begin: () => stepManager.toggleDragging(),
    end: () => stepManager.toggleDragging(),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  React.useEffect(() => {
    connectPreview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  const connectTarget = connectDrag(connectDrop(rootRef));
  const renderHandle = () => (isDragging ? null : <StepHandle />);

  return [isDragging, connectTarget, renderHandle];
};

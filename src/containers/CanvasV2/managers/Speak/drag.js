import memoizeOne from 'memoize-one';
import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';

import { compose } from '@/utils/functional';

// eslint-disable-next-line react/no-find-dom-node
const getBoundingRect = (component) => findDOMNode(component).getBoundingClientRect();
const memoizeBoundingRect = memoizeOne(getBoundingRect);

const dragSource = {
  beginDrag: (props) => ({
    id: props.id,
    index: props.index,
  }),
};

const dropTarget = {
  hover(props, monitor, component) {
    if (!component) {
      return null;
    }
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    if (dragIndex === hoverIndex) return;

    const hoverBoundingRect = memoizeBoundingRect(component);
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    const clientOffset = monitor.getClientOffset();

    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
    props.reorder(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
  },
};

const withDrag = (name) =>
  compose(
    DropTarget(name, dropTarget, (connect) => ({
      connectDropTarget: connect.dropTarget(),
    })),
    DragSource(name, dragSource, (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
      result: monitor.getDropResult(),
    }))
  );

export default withDrag;

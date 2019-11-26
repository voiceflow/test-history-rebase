import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { useDragPreview } from '@/hooks';

import DragPreviewWrapper from './components/DragPreviewWrapper';
import DropDeleteWrapper from './components/DropDeleteWrapper';
import ItemWrapper from './components/ItemWrapper';
import ListContainer from './components/ListContainer';

const useDragAndDrop = (type, handlers, props) => {
  const rootRef = React.useRef(null);

  const [, connectDrop] = useDrop({
    drop: (...args) => handlers.current.onDrop?.(...args),
    accept: type,
    hover(item, monitor) {
      item.deleteHovered = false;

      if (!rootRef.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = props.index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const { top, bottom } = rootRef.current.getBoundingClientRect();
      const hoverMiddleY = (bottom - top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      handlers.current.onReorder?.(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, connectDrag, connectPreview] = useDrag({
    item: {
      ...props,
      type,
      getStyle: () => ({
        width: rootRef.current?.clientWidth,
        height: rootRef.current?.clientHeight,
      }),
    },
    end: (...args) => handlers.current.onDragEnd?.(...args),
    begin: (...args) => handlers.current.onDragStart?.(...args),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  React.useEffect(() => {
    connectPreview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  const connectTarget = connectDrag(connectDrop(rootRef));

  return [isDragging, connectTarget];
};

// eslint-disable-next-line react/display-name
const DragPreview = React.memo(({ type, component: Preview, options, handlers }) => {
  useDragPreview(
    type,
    ({ getStyle, ...props }) => (
      <DragPreviewWrapper style={getStyle()} deleteHovered={handlers.current.deleteHovered}>
        <Preview {...props} />
      </DragPreviewWrapper>
    ),
    options
  );

  return null;
});

// eslint-disable-next-line react/display-name
const DnDItem = React.memo(({ type, itemComponent: Item, handlers, ...props }) => {
  const [isDragging, connectTarget] = useDragAndDrop(type, handlers, props);

  return (
    <ItemWrapper ref={connectTarget} style={{ opacity: isDragging ? 0 : 1 }}>
      <Item {...props} isDragging={isDragging} />
    </ItemWrapper>
  );
});

const DropDelete = React.memo(({ type, deleteComponent: Delete, handlers, deleteProps }) => {
  const rootRef = React.useRef(null);

  const [, connectDrop] = useDrop({
    drop: (item, ...args) => {
      item.deleteHovered = false;
      handlers.current.onDeleteDrop?.(item, ...args);

      return item;
    },
    accept: type,
    hover: (item) => {
      item.deleteHovered = true;
    },
  });

  const connectTarget = connectDrop(rootRef);

  return (
    <DropDeleteWrapper>
      <Delete ref={connectTarget} {...deleteProps} />
    </DropDeleteWrapper>
  );
});

function DraggableList({
  type,
  items,
  onDrop,
  onDelete,
  onEndDrag,
  onReorder,
  onStartDrag,
  deleteProps,
  itemComponent,
  previewOptions,
  deleteComponent,
  previewComponent,
}) {
  const handlers = React.useRef({});
  const [dragging, updateDragging] = React.useState(false);
  const [deleteHovered, updateDeleteHovered] = React.useState(false);

  const [, connectDrop] = useDrop({
    drop: (...args) => handlers.current.onDelete?.(...args),
    hover: (item, monitor) => {
      if (item.deleteHovered && monitor.isOver({ shallow: true })) {
        updateDeleteHovered(false);
        return;
      }

      if (deleteHovered !== item.deleteHovered) {
        updateDeleteHovered(item.deleteHovered);
      }
    },
    accept: type,
  });

  const onDeleteDrop = React.useCallback(
    (item) => {
      updateDeleteHovered(false);
      onDelete?.(item.index);
    },
    [dragging, onDelete]
  );
  const onDragEnd = React.useCallback(
    (...args) => {
      updateDragging(false);
      onEndDrag?.(...args);
    },
    [onEndDrag]
  );
  const onDragStart = React.useCallback(
    (...args) => {
      updateDragging(true);
      onStartDrag?.(...args);
    },
    [onStartDrag]
  );
  const onToggleHoverDelete = React.useCallback((value) => updateDeleteHovered(value), [updateDeleteHovered]);

  handlers.current = { onDrop, onDragEnd, onReorder, onDragStart, onToggleHoverDelete, onDeleteDrop, deleteHovered };

  return (
    <ListContainer ref={connectDrop}>
      {items.map((item, i) => (
        <DnDItem {...item} key={item.id} type={type} index={i} itemComponent={itemComponent} handlers={handlers} />
      ))}

      <DragPreview type={type} options={previewOptions} component={previewComponent} handlers={handlers} />

      {!!deleteComponent && dragging && <DropDelete type={type} handlers={handlers} deleteComponent={deleteComponent} deleteProps={deleteProps} />}
    </ListContainer>
  );
}

export default DraggableList;

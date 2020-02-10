import _throttle from 'lodash/throttle';
import React from 'react';
import { useDrop } from 'react-dnd';

import { DeleteComponent, DnDItem, DragPreview, DropDelete, ListContainer } from './components';
import { HOVER_THROTTLE_TIMEOUT } from './constants';

function DraggableList({
  type,
  items,
  onDrop,
  onDelete,
  itemProps,
  onEndDrag,
  onReorder,
  getItemKey = (item) => item,
  mapManaged,
  onStartDrag,
  deleteProps,
  itemComponent,
  previewOptions,
  deleteComponent,
  partialDragItem,
  previewComponent,
  filter,
  footer = null,
}) {
  const handlers = React.useRef({});
  const [dragging, updateDragging] = React.useState(false);
  const [deleteHovered, updateDeleteHovered] = React.useState(false);

  const [, connectDrop] = useDrop({
    drop: (...args) => handlers.current.onDelete?.(...args),
    hover: _throttle((item, monitor) => {
      if (item.deleteHovered && monitor.isOver({ shallow: true })) {
        updateDeleteHovered(false);
        return;
      }

      if (deleteHovered !== item.deleteHovered) {
        updateDeleteHovered(item.deleteHovered);
      }
    }, HOVER_THROTTLE_TIMEOUT),
    accept: type,
  });

  const onDeleteDrop = React.useCallback(
    (item) => {
      updateDeleteHovered(false);
      onDelete?.(mapManaged ? item.itemKey : item.index, item);
    },
    [onDelete, mapManaged]
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
      {mapManaged
        ? mapManaged((item, { key, index, onRemove, onUpdate }) => {
            const Item = (
              <DnDItem
                {...itemProps}
                key={key}
                item={item}
                type={type}
                index={index}
                itemKey={key}
                onRemove={onRemove}
                onUpdate={onUpdate}
                handlers={handlers}
                partialDrag={partialDragItem}
                itemComponent={itemComponent}
              />
            );

            if (filter) {
              return filter(item) ? Item : <span key={key} />;
            }

            return Item;
          })
        : items.map((item, i) => {
            const Item = (
              <DnDItem
                {...itemProps}
                key={getItemKey(item)}
                item={item}
                type={type}
                index={i}
                handlers={handlers}
                partialDrag={partialDragItem}
                itemComponent={itemComponent}
              />
            );

            if (filter) {
              return filter(item) ? Item : <span key={getItemKey(item)} />;
            }

            return Item;
          })}

      {footer}
      <DragPreview type={type} options={previewOptions} component={previewComponent} handlers={handlers} />
      {!!deleteComponent && dragging && <DropDelete type={type} handlers={handlers} deleteComponent={deleteComponent} deleteProps={deleteProps} />}
    </ListContainer>
  );
}

export { DeleteComponent };
export default DraggableList;

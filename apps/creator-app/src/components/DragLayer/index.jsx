import React, { useMemo } from 'react';
import { useDragLayer } from 'react-dnd';

import withRootPortal from '@/hocs/withRootPortal';

function CustomDragLayer({ children, ...props }) {
  const { _item, _diff, _offset, _initSourceClientOffset } = useDragLayer((monitor) => {
    const item = monitor.getItem();
    const offset = monitor.getClientOffset() || {};
    const initClientOffset = monitor.getInitialClientOffset() || {};
    const initSourceClientOffset = monitor.getInitialSourceClientOffset() || {};
    const diffX = initClientOffset.x - initSourceClientOffset.x;
    const diffY = initClientOffset.y - initSourceClientOffset.y;

    return {
      _item: item,
      _diff: { x: diffX, y: diffY },
      _offset: offset,
      _initSourceClientOffset: initSourceClientOffset,
    };
  });

  const child = useMemo(() => (_item ? children(_item, props) : null), [_item]);

  if (!_item) {
    return null;
  }

  const x = _item._allowXTransform ? _offset.x - _diff.x : _initSourceClientOffset.x;
  const y = _item._allowYTransform ? _offset.y - _diff.y : _initSourceClientOffset.y;
  return (
    <div
      style={{
        ..._item._styles,
        width: `${_item._width}px`,
        height: `${_item._height}px`,
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
      className="dnd-drag-layer"
    >
      {child}
    </div>
  );
}

export default withRootPortal()(CustomDragLayer);

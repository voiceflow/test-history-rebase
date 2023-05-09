import React from 'react';
import { useDragLayer } from 'react-dnd';
import { createPortal } from 'react-dom';

const ROOT_NODE = document.querySelector('#root')!;

interface DragLayerProps {
  children: (itemProps: any) => React.ReactNode;
}

const DragLayer: React.FC<DragLayerProps> = ({ children }) => {
  const { _item, _diff, _offset, _initSourceClientOffset } = useDragLayer((monitor) => {
    const item = monitor.getItem<any>();
    const offset = monitor.getClientOffset();
    const initClientOffset = monitor.getInitialClientOffset();
    const initSourceClientOffset = monitor.getInitialSourceClientOffset();
    const diffX = (initClientOffset?.x ?? 0) - (initSourceClientOffset?.x ?? 0);
    const diffY = (initClientOffset?.y ?? 0) - (initSourceClientOffset?.y ?? 0);

    return {
      _item: item,
      _diff: { x: diffX, y: diffY },
      _offset: offset,
      _initSourceClientOffset: initSourceClientOffset,
    };
  });

  const child = React.useMemo(() => (_item ? children(_item) : null), [_item]);

  if (!_item) return null;

  const x = _item._allowXTransform ? (_offset?.x ?? 0) - _diff.x : _initSourceClientOffset?.x ?? 0;
  const y = _item._allowYTransform ? (_offset?.y ?? 0) - _diff.y : _initSourceClientOffset?.y ?? 0;

  return createPortal(
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
    </div>,
    ROOT_NODE
  );
};

export default DragLayer;

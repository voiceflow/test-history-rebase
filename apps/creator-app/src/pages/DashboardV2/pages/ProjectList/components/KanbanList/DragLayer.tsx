import React from 'react';
import { useDragLayer } from 'react-dnd';
import { createPortal } from 'react-dom';

import { styled } from '@/hocs/styled';

const ROOT_NODE = document.querySelector('#root')!;

interface DragLayerProps {
  children: (itemProps: any) => React.ReactNode;
}

const DragLayerComp = styled.div`
  position: absolute;
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.9);
  background-image: linear-gradient(-180deg, rgba(238, 244, 246, 0.3) 0%, rgba(238, 244, 246, 0.45) 100%);
  border-radius: 7px;
  box-shadow: 0 8px 16px 0 rgba(17, 49, 96, 0.16);
  user-select: none;
  pointer-events: none;
`;

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
    <DragLayerComp
      style={{
        ..._item._styles,
        width: `${_item._width}px`,
        height: `${_item._height}px`,
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
    >
      {child}
    </DragLayerComp>,
    ROOT_NODE
  );
};

export default DragLayer;

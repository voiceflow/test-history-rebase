import React from 'react';

import * as S from './styles';
import useResize from './useResize';

interface ResizableProps extends React.PropsWithChildren {
  onResize?: (dimensions: [number, number]) => void;
  onResizeEnd?: (dimensions: [number, number]) => void;
  onResizeStart?: () => void;
  renderHandle?: (props: { onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void }) => React.ReactNode;

  axis?: 'x' | 'y' | 'both';

  width?: number;
  height?: number;

  minWidth?: number;
  maxWidth?: number;

  minHeight?: number;
  maxHeight?: number;

  disabled?: boolean;
}

const defaultHandle = ({ axis, onMouseDown }: { axis: ResizableProps['axis']; onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void }) => {
  const Component = axis === 'x' ? S.VerticalHandle : S.HorizontalHandle;

  return <Component onMouseDown={onMouseDown} />;
};

const Resizable: React.FC<ResizableProps> = ({
  children,
  disabled,
  minHeight,
  minWidth,
  maxHeight,
  maxWidth,
  axis = 'x',
  renderHandle = defaultHandle,
  onResizeEnd,
  onResizeStart,
  ...props
}) => {
  const { containerRef, onMouseDown } = useResize({
    disabled,
    axis,
    onResizeEnd,
    onResizeStart,
    width: props.width,
    height: props.height,
    minHeight,
    minWidth,
    maxHeight,
    maxWidth,
  });

  return (
    <S.Container
      ref={containerRef}
      minHeight={minHeight}
      minWidth={minWidth}
      maxHeight={maxHeight}
      maxWidth={maxWidth}
      width={props.width}
      height={props.height}
    >
      {['y', 'both'].includes(axis) && renderHandle({ onMouseDown, axis: 'y' })}
      {['x', 'both'].includes(axis) && renderHandle({ onMouseDown, axis: 'x' })}
      <S.Content>{children}</S.Content>
    </S.Container>
  );
};

export default Object.assign(Resizable, {
  HorizontalHandle: S.HorizontalHandle,
  VerticalHandle: S.VerticalHandle,
});

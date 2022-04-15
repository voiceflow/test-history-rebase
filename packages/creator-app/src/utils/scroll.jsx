import React from 'react';
import SimpleBar from 'simplebar-react';

export const DragScroll = ({ children, ...props }) => {
  const container = React.useRef();
  const drag = React.useRef(false);

  const mouseUpHandle = React.useCallback(() => {
    drag.current = false;
  }, []);

  const mouseDownHandle = React.useCallback((event) => {
    if (!drag.current) {
      drag.current = {
        x: event.clientX,
        y: event.clientY,
      };
      event.preventDefault();
    }
  }, []);

  const mouseMoveHandle = React.useCallback((event) => {
    if (drag.current) {
      const { x: lastClientX, y: lastClientY } = drag.current;
      container.current.scrollLeft -= -lastClientX + event.clientX;
      container.current.scrollTop -= -lastClientY + event.clientY;
      drag.current = {
        x: event.clientX,
        y: event.clientY,
      };
    }
  }, []);

  return (
    <SimpleBar
      {...props}
      onMouseDown={mouseDownHandle}
      onMouseMove={mouseMoveHandle}
      onMouseUp={mouseUpHandle}
      onMouseLeave={mouseUpHandle}
      scrollableNodeProps={{ ref: container }}
    >
      {children}
    </SimpleBar>
  );
};

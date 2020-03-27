declare module 'mouse-event-offset' {
  import React from 'react';

  const mouseEventOffset: (event: MouseEvent | React.MouseEvent, el: HTMLElement) => [number, number];

  export default mouseEventOffset;
}

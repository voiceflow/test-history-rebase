declare module 'mouse-event-offset' {
  import React from 'react';

  const mouseEventOffset: (event: MouseEvent | UIEvent | React.UIEvent | React.MouseEvent, el: HTMLElement) => [number, number];

  export default mouseEventOffset;
}

import React from 'react';
import { Manager, Popper, Reference } from 'react-popper';

function DropwdownMenu({ show, component, placement = 'bottom-start', children }) {
  return (
    <Manager>
      <Reference>{({ ref }) => children(ref)}</Reference>
      {show && (
        <Popper placement={placement}>
          {({ ref, style, placement, arrowProps }) => (
            <div ref={ref} style={style} data-placement={placement}>
              {component}
              <div ref={arrowProps.ref} style={arrowProps.style} />
            </div>
          )}
        </Popper>
      )}
    </Manager>
  );
}

export default DropwdownMenu;

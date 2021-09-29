import { Menu, Portal, useVirtualElementPopper } from '@voiceflow/ui';
import React from 'react';

import SidebarIconMenu from '@/components/SidebarIconMenu';

import { useCanvasMenuOptionsAndHotkeys, useHelpOptions } from './hooks';

const CanvasMenu: React.FC = () => {
  const helpOptions = useHelpOptions();
  const { options, activeValue, helpOpened, footerOptions, helpButtonRef } = useCanvasMenuOptionsAndHotkeys();

  const popper = useVirtualElementPopper(helpButtonRef.current, {
    placement: 'right-end',
    modifiers: [{ name: 'offset', options: { offset: [5, -8] } }],
  });

  return (
    <>
      <SidebarIconMenu open options={options} activeValue={activeValue} footerOptions={footerOptions} />

      {helpOpened && (
        <Portal>
          <div ref={popper.setPopperElement} style={{ ...popper.styles.popper, zIndex: 1100 }} {...popper.attributes.popper}>
            <Menu options={helpOptions} />
          </div>
        </Portal>
      )}
    </>
  );
};

export default CanvasMenu;

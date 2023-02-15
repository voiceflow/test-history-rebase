import { Menu, Portal, useVirtualElementPopper } from '@voiceflow/ui';
import React from 'react';

import SidebarIconMenu from '@/components/SidebarIconMenu';
import { useIsCanvasDesignOnly } from '@/hooks';

import { useCanvasMenuOptionsAndHotkeys, useHelpOptions } from './hooks';

const CanvasIconMenu: React.FC = () => {
  const designOnly = useIsCanvasDesignOnly();
  const helpOptions = useHelpOptions();

  const { options, activeValue, helpOpened, footerOptions, helpButtonRef } = useCanvasMenuOptionsAndHotkeys();

  const popper = useVirtualElementPopper(helpButtonRef.current, {
    placement: 'right-end',
    modifiers: [{ name: 'offset', options: { offset: [5, -8] } }],
  });

  return (
    <>
      <SidebarIconMenu open={!designOnly} options={options} activeValue={activeValue} footerOptions={footerOptions} />

      {helpOpened && (
        <Portal>
          <div ref={popper.setPopperElement} style={{ ...popper.styles.popper }} {...popper.attributes.popper}>
            <Menu options={helpOptions} />
          </div>
        </Portal>
      )}
    </>
  );
};

export default CanvasIconMenu;

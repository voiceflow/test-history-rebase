import { Menu, Portal } from '@voiceflow/ui';
import React from 'react';
import { Popper } from 'react-popper';

import SidebarIconMenu from '@/components/SidebarIconMenu';

import { useCanvasMenuOptionsAndHotkeys, useHelpOptions } from './hooks';

const CanvasMenu: React.FC = () => {
  const helpOptions = useHelpOptions();
  const { options, activeValue, helpOpened, footerOptions, helpButtonRef } = useCanvasMenuOptionsAndHotkeys();

  return (
    <>
      <SidebarIconMenu open options={options} activeValue={activeValue} footerOptions={footerOptions} />

      {helpOpened && (
        <Portal>
          <Popper placement="right" referenceElement={helpButtonRef.current ?? undefined}>
            {({ ref, style }) => (
              <div ref={ref} style={{ ...style, zIndex: 1100, marginBottom: '14px', marginLeft: '-8px' }}>
                <Menu options={helpOptions} />
              </div>
            )}
          </Popper>
        </Portal>
      )}
    </>
  );
};

export default CanvasMenu;

import { Menu, Portal, useVirtualElementPopper } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import SidebarIconMenu from '@/components/SidebarIconMenu';
import { useIsCanvasDesignOnly, useTheme } from '@/hooks';
import { useLogoButtonOptions } from '@/pages/Project/components/Header/hooks';

import { SideBarComponentProps } from '../../types';
import { useCanvasMenuOptionsAndHotkeys, useHelpOptions } from './hooks';

const CanvasIconMenu: React.FC<SideBarComponentProps> = ({ withLogo = false }) => {
  const theme = useTheme();
  const designOnly = useIsCanvasDesignOnly();
  const helpOptions = useHelpOptions();
  const logoOptions = useLogoButtonOptions();
  const { options, activeValue, helpOpened, footerOptions, helpButtonRef } = useCanvasMenuOptionsAndHotkeys();

  const popper = useVirtualElementPopper(helpButtonRef.current, {
    placement: 'right-end',
    modifiers: [{ name: 'offset', options: { offset: [5, -8] } }],
  });

  return (
    <>
      <SidebarIconMenu
        open={!designOnly}
        options={options}
        activeValue={activeValue}
        footerOptions={footerOptions}
        header={
          withLogo ? (
            <Page.Header.LogoButton
              style={{ height: `${theme.components.page.header.height}px`, margin: '0 0 20px 0', borderBottom: '1px solid #dfe3ed' }}
              options={logoOptions}
              withBorder={false}
            />
          ) : null
        }
      />

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

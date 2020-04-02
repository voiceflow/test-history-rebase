import React from 'react';

import { OverlayContext } from '@/contexts';
import { withContext, withStaticContext } from '@/hocs';
import { ContextMenuTarget } from '@/pages/Canvas/constants';

export type MenuContext = {
  position: [number, number];
  type: ContextMenuTarget;
  target: string | null;
};

export type ContextMenuValue = Partial<MenuContext> & {
  isOpen: boolean;
  onOpen: (event: React.MouseEvent, type: ContextMenuTarget, target: string | null) => void;
  onHide: () => void;
};

export const ContextMenuContext = React.createContext<ContextMenuValue | null>(null);
export const { Consumer: ContextMenuConsumer } = ContextMenuContext;

export const ContextMenuProvider: React.FC = ({ children }) => {
  const overlay = React.useContext(OverlayContext)!;
  const [menuContext, setMenuContext] = React.useState<MenuContext | null>(null);

  const onHide = () => {
    if (menuContext === null) {
      return;
    }

    setMenuContext(null);
    overlay.setHandler(null);
  };
  const onOpen = (event: React.MouseEvent, type = ContextMenuTarget.CANVAS, target: string | null = null) => {
    event.preventDefault();

    if (!overlay.canOpen()) {
      return;
    }

    // defense for ctrl-click on chrome and safari ¯\_(ツ)_/¯
    if (!event.ctrlKey) {
      overlay.setHandler(() => {
        setMenuContext(null);
        overlay.setHandler(null);
      });
    }

    setMenuContext({ position: [event.clientX, event.clientY], type, target });
  };

  return (
    <ContextMenuContext.Provider
      value={{
        ...menuContext,
        isOpen: !!menuContext,
        onOpen,
        onHide,
      }}
    >
      {children}
    </ContextMenuContext.Provider>
  );
};

export const withContextMenu = withContext(ContextMenuContext, 'contextMenu');
export const withStaticContextMenu = withStaticContext(ContextMenuContext, 'contextMenu');

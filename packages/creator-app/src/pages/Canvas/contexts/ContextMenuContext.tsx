import { OverlayContext, useContextApi, useSmartReducerV2, withContext, withStaticContext } from '@voiceflow/ui';
import React from 'react';

import { ContextMenuTarget } from '@/pages/Canvas/constants';
import { Nullable } from '@/types';

import { EngineContext } from './EngineContext';

export type MenuContext = {
  type: ContextMenuTarget;
  target: string | null;
  position: [number, number];
};

export type ContextMenuValue = Partial<MenuContext> & {
  isOpen: boolean;
  onOpen: (event: React.MouseEvent, type?: ContextMenuTarget, target?: Nullable<string>) => void;
  onHide: () => void;
};

export const ContextMenuContext = React.createContext<Nullable<ContextMenuValue>>(null);
export const { Consumer: ContextMenuConsumer } = ContextMenuContext;

export const ContextMenuProvider: React.FC = ({ children }) => {
  const engine = React.useContext(EngineContext)!;
  const overlay = React.useContext(OverlayContext)!;

  const [menuContext, menuContextApi] = useSmartReducerV2<Partial<MenuContext>>({ type: undefined, target: undefined, position: undefined });

  const onHide = React.useCallback(() => {
    if (menuContext === null) {
      return;
    }

    menuContextApi.reset();
    overlay.setHandler(null);
  }, [engine, overlay]);

  const onOpen = React.useCallback(
    (event: React.MouseEvent, type = ContextMenuTarget.CANVAS, target: Nullable<string> = null) => {
      event.preventDefault();

      if (!overlay.canOpen()) {
        return;
      }

      // defense for ctrl-click on chrome and safari ¯\_(ツ)_/¯
      if (!event.ctrlKey) {
        overlay.setHandler(() => {
          menuContextApi.reset();
          overlay.setHandler(null);
        });
      }

      if (type === ContextMenuTarget.NODE && target && engine.selection.isOneOfManyTargets(target)) {
        menuContextApi.set({ position: [event.clientX, event.clientY], type: ContextMenuTarget.SELECTION, target: null });

        return;
      }

      if (target) {
        engine.selection.replace([target]);
      } else {
        engine.selection.reset();
      }

      menuContextApi.set({ position: [event.clientX, event.clientY], type, target });
    },
    [engine, overlay]
  );

  const api = useContextApi({ ...menuContext, isOpen: !!menuContext, onOpen, onHide });

  return <ContextMenuContext.Provider value={api}>{children}</ContextMenuContext.Provider>;
};

export const withContextMenu = withContext(ContextMenuContext, 'contextMenu');
export const withStaticContextMenu = withStaticContext(ContextMenuContext, 'contextMenu');

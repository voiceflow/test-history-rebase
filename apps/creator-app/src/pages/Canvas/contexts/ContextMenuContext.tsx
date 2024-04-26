import type { Nullable } from '@voiceflow/common';
import { useContextApi, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';
import { DismissableLayerContext } from 'react-dismissable-layers';

import { ContextMenuTarget } from '@/pages/Canvas/constants';

import { EntityType } from '../engine/constants';
import { EngineContext } from './EngineContext';

export interface MenuContext {
  type: ContextMenuTarget;
  target: string | null;
  position: [number, number];
}

export type ContextMenuValue = Partial<MenuContext> & {
  isOpen: boolean;
  onOpen: (event: React.MouseEvent, type?: ContextMenuTarget, target?: Nullable<string>) => void;
  onHide: () => void;
};

export const ContextMenuContext = React.createContext<Nullable<ContextMenuValue>>(null);
export const { Consumer: ContextMenuConsumer } = ContextMenuContext;

export const ContextMenuProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const engine = React.useContext(EngineContext)!;
  const dismissOverlay = React.useContext(DismissableLayerContext)!;

  const [menuContext, menuContextApi] = useSmartReducerV2<Partial<MenuContext>>({
    type: undefined,
    target: undefined,
    position: undefined,
  });

  const onHide = React.useCallback(() => {
    dismissOverlay.removeHandler('click', onHide);
    menuContextApi.reset();
  }, []);

  const onOpen = React.useCallback(
    (event: React.MouseEvent, type = ContextMenuTarget.CANVAS, target: Nullable<string> = null) => {
      event.preventDefault();

      if (dismissOverlay.hasHandlersGlobally()) {
        dismissOverlay.dismissAllGlobally();
      }

      dismissOverlay.addHandler('click', onHide);

      if (type === ContextMenuTarget.NODE && target && engine.selection.isOneOfManyTargets(EntityType.NODE, target)) {
        menuContextApi.set({
          position: [event.clientX, event.clientY],
          type: ContextMenuTarget.SELECTION,
          target: null,
        });

        return;
      }

      if (target) {
        engine.selection.replaceNode([target]);
      } else {
        engine.selection.reset();
      }

      menuContextApi.set({ position: [event.clientX, event.clientY], type, target });
    },
    [engine, dismissOverlay]
  );

  const api = useContextApi({ ...menuContext, isOpen: Object.values(menuContext).some(Boolean), onOpen, onHide });

  return <ContextMenuContext.Provider value={api}>{children}</ContextMenuContext.Provider>;
};

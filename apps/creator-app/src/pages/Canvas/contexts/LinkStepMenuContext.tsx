import type { Nullable } from '@voiceflow/common';
import { useContextApi, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

import type { Point } from '@/types';
import { Coords } from '@/utils/geometry';

import { EngineContext } from './Engine.context';

export interface LinkStepMenuValue {
  isOpen: boolean;
  onOpen: (event: MouseEvent) => void;
  onHide: (options?: { abort?: boolean }) => void;
  position: Point;
  nodePosition: Coords | null;
  sourcePortID: string | null;
  parentActionsPath: string;
  parentActionsParams: Record<string, string>;
}

export const LinkStepMenuContext = React.createContext<Nullable<LinkStepMenuValue>>(null);
export const { Consumer: LinkStepMenuConsumer } = LinkStepMenuContext;

export const LinkStepMenuProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const engine = React.useContext(EngineContext)!;

  const [state, stateAPI] = useSmartReducerV2({
    isOpen: false,
    position: [0, 0] as Point,
    nodePosition: null as Coords | null,
    sourcePortID: null as string | null,
    parentActionsPath: '',
    parentActionsParams: {} as Record<string, string>,
  });

  const onHide = React.useCallback(({ abort }: { abort?: boolean } = {}) => {
    if (abort) engine.linkCreation.abort();

    stateAPI.reset();
  }, []);

  const onOpen = React.useCallback(
    (event: MouseEvent) => {
      event.preventDefault();

      stateAPI.set({
        isOpen: true,
        position: [event.clientX, event.clientY],
        nodePosition: engine.getMouseCoords() || new Coords([event.clientX, event.clientY]),
        sourcePortID: engine.linkCreation.sourcePortID,
        parentActionsPath: engine.linkCreation.parentActionsPath,
        parentActionsParams: engine.linkCreation.parentActionsParams,
      });

      engine.linkCreation.blockViaLinkMenuShown();
    },
    [engine]
  );

  const api = useContextApi({ ...state, onOpen, onHide });

  return <LinkStepMenuContext.Provider value={api}>{children}</LinkStepMenuContext.Provider>;
};

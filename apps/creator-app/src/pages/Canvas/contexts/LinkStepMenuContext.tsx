import { Nullable } from '@voiceflow/common';
import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { Point } from '@/types';
import { Coords } from '@/utils/geometry';

import { EngineContext } from './EngineContext';

export interface LinkStepMenuValue {
  isOpen: boolean;
  onOpen: (event: MouseEvent) => void;
  onHide: (options?: { abort?: boolean }) => void;
  position: Point;
  nodePosition: Coords | null;
}

export const LinkStepMenuContext = React.createContext<Nullable<LinkStepMenuValue>>(null);
export const { Consumer: LinkStepMenuConsumer } = LinkStepMenuContext;

export const LinkStepMenuProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const engine = React.useContext(EngineContext)!;
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [position, setPosition] = React.useState<Point>([0, 0]);
  const [nodePosition, setNodePosition] = React.useState<Coords | null>(null);

  const onHide = React.useCallback(({ abort }: { abort?: boolean } = {}) => {
    if (abort) engine.linkCreation.abort();

    setIsOpen(false);
    setPosition([0, 0]);
    setNodePosition(null);
  }, []);

  const onOpen = React.useCallback(
    (event: MouseEvent) => {
      event.preventDefault();

      setPosition([event.clientX, event.clientY]);
      setNodePosition(engine.getMouseCoords() || new Coords([event.clientX, event.clientY]));
      setIsOpen(true);

      engine.linkCreation.blockViaLinkMenuShown();
    },
    [engine]
  );

  const api = useContextApi({ isOpen, position, nodePosition, onOpen, onHide });

  return <LinkStepMenuContext.Provider value={api}>{children}</LinkStepMenuContext.Provider>;
};

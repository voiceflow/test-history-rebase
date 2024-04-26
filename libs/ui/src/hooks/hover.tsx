import React from 'react';

import { useContextApi, usePersistFunction } from './cache';
import { useEnableDisable } from './toggle';

type HoverEventHandler = 'onMouseEnter' | 'onMouseLeave';

export interface HoverValue {
  isHovered: boolean;
  setOverride: () => void;
  clearOverride: () => void;
}

export const HoverContext = React.createContext<HoverValue | null>(null);
const { Provider: HoverProvider } = HoverContext;

interface HoverOptions {
  onStart?: () => boolean | void;
  onEnd?: () => boolean | void;
  onMove?: () => boolean | void;
  cleanupOnOverride?: boolean;
}

interface HoverAPI {
  isHovered: boolean;
  setHovering: (hovering: boolean) => void;
  wrapElement: (el: JSX.Element) => JSX.Element;
  hoverHandlers: Record<HoverEventHandler, () => void>;
}

export const useHover = (
  { onStart, onEnd, onMove, cleanupOnOverride = true }: HoverOptions = { onStart: () => true }
): HoverAPI => {
  const onHoverEnd = React.useRef<(() => void) | null>(null);
  const [isHovered, setHovering] = React.useState(false);
  const [isOverridden, enableOverride, disableOverride] = useEnableDisable();
  const parentHover = React.useContext(HoverContext);

  const onMouseEnter = usePersistFunction(() => {
    if (!onStart?.()) return;

    setHovering(true);

    onHoverEnd.current = onEnd || null;
    parentHover?.setOverride();
  });

  const onMouseLeave = usePersistFunction(() => {
    setHovering(false);

    parentHover?.clearOverride();

    if (!parentHover || cleanupOnOverride) {
      onHoverEnd.current?.();
      onHoverEnd.current = null;
    }
  });

  const onMouseMove = usePersistFunction(() => {
    if (onMove?.()) return;
    onMouseLeave();
  });

  const setOverride = usePersistFunction(() => {
    enableOverride();

    if (cleanupOnOverride) {
      onHoverEnd.current?.();
      onHoverEnd.current = null;
    }
  });

  const clearOverride = usePersistFunction(() => {
    disableOverride();
    onStart?.();

    if (cleanupOnOverride) {
      onHoverEnd.current = onEnd || null;
    }
  });

  const api = useContextApi({ isHovered, setOverride, clearOverride });

  const wrapElement = React.useCallback((el: JSX.Element) => <HoverProvider value={api}>{el}</HoverProvider>, [api]);

  const hoverHandlers = React.useMemo(
    () => ({ onMouseEnter, onMouseLeave, onMouseMove: onMove ? onMouseMove : undefined }),
    []
  );

  return {
    isHovered: !isOverridden && isHovered,
    setHovering,
    wrapElement,
    hoverHandlers,
  };
};

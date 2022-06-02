import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { HoverContext, HoverProvider } from '@/contexts/HoverContext';

import { useEnableDisable } from './toggle';

type HoverEventHandler = 'onMouseEnter' | 'onMouseLeave';

interface HoverOptions {
  onStart?: () => boolean | void;
  onEnd?: () => boolean | void;
  onMove?: () => boolean | void;
  cleanupOnOverride?: boolean;
}

export const useHover = (
  { onStart, onEnd, onMove, cleanupOnOverride = true }: HoverOptions = { onStart: () => true },
  dependencies: any[] = []
): [boolean, (el: JSX.Element) => JSX.Element, Record<HoverEventHandler, () => void>, (hovering: boolean) => void] => {
  const onHoverEnd = React.useRef<(() => void) | null>(null);
  const [isHovered, setHovering] = React.useState(false);
  const [isOverridden, enableOverride, disableOverride] = useEnableDisable();
  const parentHover = React.useContext(HoverContext);

  const onMouseEnter = React.useCallback(() => {
    if (onStart?.()) {
      setHovering(true);

      onHoverEnd.current = onEnd || null;
      parentHover?.setOverride();
    }
  }, [parentHover?.setOverride, ...dependencies]);
  const onMouseLeave = React.useCallback(() => {
    setHovering(false);

    parentHover?.clearOverride();

    if (!parentHover || cleanupOnOverride) {
      onHoverEnd.current?.();
      onHoverEnd.current = null;
    }
  }, [parentHover?.clearOverride]);
  const onMouseMove = React.useCallback(() => {
    if (onMove && !onMove()) {
      onMouseLeave();
    }
  }, [onMove, onMouseLeave]);
  const setOverride = React.useCallback(() => {
    enableOverride();

    if (cleanupOnOverride) {
      onHoverEnd.current?.();
      onHoverEnd.current = null;
    }
  }, dependencies);
  const clearOverride = React.useCallback(() => {
    disableOverride();

    onStart?.();

    if (cleanupOnOverride) {
      onHoverEnd.current = onEnd || null;
    }
  }, dependencies);

  const api = useContextApi({ isHovered, setOverride, clearOverride });

  const wrapElement = React.useCallback((el: JSX.Element) => <HoverProvider value={api}>{el}</HoverProvider>, [api]);

  const hoverHandlers = React.useMemo(
    () => ({ onMouseEnter, onMouseLeave, onMouseMove: onMove ? onMouseMove : undefined }),
    [onMouseEnter, onMouseLeave, onMouseMove]
  );

  return [!isOverridden && isHovered, wrapElement, hoverHandlers, setHovering];
};

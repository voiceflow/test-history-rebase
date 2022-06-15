import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { HoverContext, HoverProvider } from '@/contexts/HoverContext';

import { useEnableDisable } from './toggle';

type HoverEventHandler = 'onMouseEnter' | 'onMouseLeave';

interface HoverOptions {
  onEnd?: (event?: React.MouseEvent<HTMLElement>) => boolean | void;
  onMove?: (event?: React.MouseEvent<HTMLElement>) => boolean | void;
  onStart?: (event?: React.MouseEvent<HTMLElement>) => boolean | void;
  cleanupOnOverride?: boolean;
}

export const useHover = (
  { onEnd, onMove, onStart, cleanupOnOverride = true }: HoverOptions = { onStart: () => true },
  dependencies: any[] = []
): [boolean, (el: JSX.Element) => JSX.Element, Record<HoverEventHandler, React.MouseEventHandler<HTMLElement>>, (hovering: boolean) => void] => {
  const onHoverEnd = React.useRef<((event?: React.MouseEvent<HTMLElement>) => boolean | void) | null>(null);
  const [isHovered, setHovering] = React.useState(false);
  const [isOverridden, enableOverride, disableOverride] = useEnableDisable();
  const parentHover = React.useContext(HoverContext);

  const onMouseEnter = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (onStart?.(event)) {
        setHovering(true);

        onHoverEnd.current = onEnd || null;
        parentHover?.setOverride(event);
      }
    },
    [parentHover?.setOverride, ...dependencies]
  );

  const onMouseLeave = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setHovering(false);

      parentHover?.clearOverride(event);

      if (!parentHover || cleanupOnOverride) {
        onHoverEnd.current?.(event);
        onHoverEnd.current = null;
      }
    },
    [parentHover?.clearOverride]
  );

  const onMouseMove = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (onMove && !onMove(event)) {
        onMouseLeave(event);
      }
    },
    [onMove, onMouseLeave]
  );

  const setOverride = React.useCallback((event?: React.MouseEvent<HTMLElement>) => {
    enableOverride();

    if (cleanupOnOverride) {
      onHoverEnd.current?.(event);
      onHoverEnd.current = null;
    }
  }, dependencies);

  const clearOverride = React.useCallback((event?: React.MouseEvent<HTMLElement>) => {
    disableOverride();

    onStart?.(event);

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

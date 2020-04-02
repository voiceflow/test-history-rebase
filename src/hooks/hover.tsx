import React from 'react';

import { HoverContext, HoverProvider } from '@/contexts/HoverContext';

import { useEnableDisable } from './toggle';

type HoverEventHandler = 'onMouseEnter' | 'onMouseLeave';

// eslint-disable-next-line import/prefer-default-export
export const useHover = (
  {
    onStart,
    onEnd,
    cleanupOnOverride = true,
  }: {
    onStart?: () => boolean | void;
    onEnd?: () => boolean | void;
    cleanupOnOverride?: boolean;
  },
  dependencies: any[] = []
): [boolean, (el: JSX.Element) => JSX.Element, Record<HoverEventHandler, () => void>] => {
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
  const value = React.useMemo(() => ({ isHovered, setOverride, clearOverride }), [isHovered, setOverride, clearOverride]);
  const wrapElement = React.useCallback((el: JSX.Element) => <HoverProvider value={value}>{el}</HoverProvider>, [value]);

  const hoverHandlers = React.useMemo(() => ({ onMouseEnter, onMouseLeave }), [onMouseEnter, onMouseLeave]);

  return [!isOverridden && isHovered, wrapElement, hoverHandlers];
};

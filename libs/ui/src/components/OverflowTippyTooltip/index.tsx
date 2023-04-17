import { usePersistFunction, useResizeObserver, useToggle } from '@ui/hooks';
import React from 'react';

import TippyTooltip from '../TippyTooltip';
import * as T from './types';

export * as OverflowTippyTooltipTypes from './types';

const defaultIsChildrenOverflow = (node: HTMLElement) => node.scrollWidth > node.clientWidth;

const OverflowTippyTooltip = <E extends HTMLElement = HTMLElement>({
  style,
  overflow,
  children,
  isChildrenOverflow,
  ...props
}: T.Props<E>): React.ReactElement => {
  const ref = React.useRef<E>(null);
  const [isOverflow, toggleIsOverflow] = useToggle(false);

  const persistIsChildrenOverflow = usePersistFunction(isChildrenOverflow ?? defaultIsChildrenOverflow);
  const checkForOverflow = () => {
    if (!ref.current) return;

    toggleIsOverflow(persistIsChildrenOverflow(ref.current));
  };

  useResizeObserver(ref, checkForOverflow);

  React.useLayoutEffect(() => checkForOverflow(), [props.content]);

  return (
    <TippyTooltip
      style={{ ...(overflow && { display: 'flex', overflow: 'hidden' }), ...style }}
      delay={[300, 0]}
      offset={[0, 6]}
      disabled={!isOverflow}
      position="top"
      {...props}
    >
      {children(ref, { isOverflow })}
    </TippyTooltip>
  );
};

export default OverflowTippyTooltip;

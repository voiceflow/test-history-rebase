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

  // eslint-disable-next-line xss/no-mixed-html
  React.useLayoutEffect(() => checkForOverflow(), [props.title, props.html]);

  return (
    <TippyTooltip
      style={{ ...(overflow && { display: 'flex', overflow: 'hidden' }), ...style }}
      delay={[300, 0]}
      disabled={!isOverflow}
      position="top"
      distance={6}
      bodyOverflow
      {...props}
    >
      {children(ref, { isOverflow })}
    </TippyTooltip>
  );
};

export default OverflowTippyTooltip;

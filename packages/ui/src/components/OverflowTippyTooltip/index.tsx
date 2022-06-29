import { usePersistFunction, useResizeObserver, useToggle } from '@ui/hooks';
import React from 'react';

import TippyTooltip from '../TippyTooltip';
import * as T from './types';

export * as OverflowTippyTooltipTypes from './types';

const defaultIsChildrenOverflow = (node: HTMLElement) => node.scrollWidth > node.clientWidth;

const OverflowTippyTooltip = <E extends HTMLElement = HTMLElement>({ children, isChildrenOverflow, ...props }: T.Props<E>): React.ReactElement => {
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
    <TippyTooltip disabled={!isOverflow} delay={300} position="top" distance={6} hideDelay={0} bodyOverflow={true} {...props}>
      {children(ref, { isOverflow })}
    </TippyTooltip>
  );
};

export default OverflowTippyTooltip;

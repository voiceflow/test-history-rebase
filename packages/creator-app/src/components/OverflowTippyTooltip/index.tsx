import { TippyTooltip, TippyTooltipProps, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import { useToggle } from '@/hooks';

export interface OverflowTippyTooltipProps<E extends HTMLElement = HTMLElement> extends TippyTooltipProps {
  children: (ref: React.RefObject<E>, options: { isOverflow?: boolean }) => React.ReactNode;
  isChildrenOverflow?: (node: E) => boolean;
}

const defaultIsChildrenOverflow = (node: HTMLElement) => node.scrollWidth > node.clientWidth;

const OverflowTippyTooltip = <E extends HTMLElement = HTMLElement>({
  children,
  isChildrenOverflow,
  ...props
}: OverflowTippyTooltipProps<E>): React.ReactElement => {
  const ref = React.useRef<E>(null);
  const [isOverflow, toggleIsOverflow] = useToggle(false);

  const persistIsChildrenOverflow = usePersistFunction(isChildrenOverflow ?? defaultIsChildrenOverflow);

  // eslint-disable-next-line xss/no-mixed-html
  React.useEffect(() => {
    if (!ref.current) {
      return;
    }

    toggleIsOverflow(persistIsChildrenOverflow(ref.current));
    // eslint-disable-next-line xss/no-mixed-html
  }, [props.title, props.html]);

  const Container = isOverflow ? TippyTooltip : React.Fragment;

  return (
    <Container
      {...(isOverflow
        ? {
            delay: 300,
            position: 'top',
            distance: 6,
            hideDelay: 0,
            ...props,
            popperOptions: {
              modifiers: {
                ...props?.popperOptions?.modifiers,
                preventOverflow: { boundariesElement: document.body, ...props.popperOptions?.preventOverflow },
              },
            },
          }
        : {})}
    >
      {children(ref, { isOverflow })}
    </Container>
  );
};

export default OverflowTippyTooltip;

import { useLayoutEffect, useRef, useState } from 'react';

export const useScrollIntoView = <Elm extends Element>() => {
  const ref = useRef<Elm>(null);

  return {
    ref,
    scroll: (options?: ScrollIntoViewOptions) => ref.current?.scrollIntoView(options),
  };
};

export const useAutoScrollIntoView = <Elm extends Element>({
  options,
  condition,
  dependencies = [],
}: {
  options?: ScrollIntoViewOptions;
  condition: boolean;
  dependencies?: unknown[];
}) => {
  const scrollIntoView = useScrollIntoView<Elm>();

  useLayoutEffect(() => {
    if (!condition) return;

    scrollIntoView.scroll(options);
  }, [condition, ...dependencies]);

  return scrollIntoView;
};

export const useAutoScrollListItemIntoView = <Elm extends Element = HTMLDivElement>({
  options = { block: 'nearest', behavior: 'smooth' },
}: { options?: ScrollIntoViewOptions } = {}) => {
  const [itemID, setItemID] = useState<string | null>(null);

  const scrollIntoView = useScrollIntoView<Elm>();

  useLayoutEffect(() => {
    if (!itemID) return;

    scrollIntoView.scroll(options);
    setItemID(null);
  }, [itemID]);

  return {
    itemRef: (listItemID: string) => (listItemID === itemID ? scrollIntoView.ref : undefined),
    setItemID,
  };
};

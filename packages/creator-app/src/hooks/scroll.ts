import { CustomScrollbarsTypes, useCache, useContextApi, useRAF } from '@voiceflow/ui';
import React from 'react';

import { ScrollContext, ScrollContextValue } from '@/contexts/ScrollContext';
import { getOffsetLeftToNode, getOffsetToNode, scrollTo, setScrollbarOffset } from '@/utils/dom';
import { xnor, xor } from '@/utils/logic';

import { useToggle } from './toggle';

interface ScrollHelpers<B extends HTMLElement | CustomScrollbarsTypes.Scrollbars, I extends HTMLElement | null> {
  bodyRef: React.RefObject<B>;
  innerRef: React.RefObject<I>;
  scrollHelpers: ScrollContextValue<B>;
}

const isScrollbars = (value?: null | HTMLElement | CustomScrollbarsTypes.Scrollbars): value is CustomScrollbarsTypes.Scrollbars =>
  !!value && 'getValues' in value;

export const useScrollHelpers = <B extends HTMLElement | CustomScrollbarsTypes.Scrollbars, I extends HTMLElement | null = null>({
  enableScrollbarOffset,
}: { enableScrollbarOffset?: boolean } = {}): ScrollHelpers<B, I> => {
  const [scheduler] = useRAF();

  const bodyRef = React.useRef<B>(null);
  const innerRef = React.useRef<I>(null);

  const scrollHelpers = React.useRef<ScrollContextValue<B>>({
    scrollRef: bodyRef,

    scrollToNode(node: HTMLElement, padding = 0) {
      if (isScrollbars(bodyRef.current)) {
        const offset = getOffsetToNode(node, bodyRef.current.view);

        bodyRef.current.scrollTop(offset - padding);
      } else {
        const offset = getOffsetToNode(node, bodyRef.current);

        scrollTo(bodyRef.current, { top: offset - padding });
      }
    },

    setScrollBarOffset() {
      if (enableScrollbarOffset) {
        scheduler(() => !isScrollbars(bodyRef.current) && setScrollbarOffset(bodyRef.current, innerRef.current));
      }
    },

    scrollHorizontalToNode(node: HTMLElement, padding = 0) {
      if (isScrollbars(bodyRef.current)) {
        const offset = getOffsetLeftToNode(node, bodyRef.current.view);

        bodyRef.current.scrollLeft(offset - padding);
      } else {
        const offset = getOffsetLeftToNode(node, bodyRef.current);

        scrollTo(bodyRef.current, { left: offset - padding });
      }
    },
  });

  React.useEffect(() => scrollHelpers.current.setScrollBarOffset());

  return useContextApi({
    bodyRef,
    innerRef,
    scrollHelpers: scrollHelpers.current,
  });
};

export const useScrollContext = <T extends HTMLElement | CustomScrollbarsTypes.Scrollbars>(): ScrollContextValue<T> =>
  React.useContext(ScrollContext) as ScrollContextValue<T>;

export const useHorizontalScrollToNode = <T extends HTMLElement>(
  ref: React.RefObject<T>,
  condition?: boolean,
  recallEffectFields: unknown[] = []
): void => {
  const { scrollHorizontalToNode } = React.useContext(ScrollContext) ?? {};

  React.useEffect(() => {
    if (!condition || !ref.current) {
      return;
    }

    scrollHorizontalToNode?.(ref.current);
  }, recallEffectFields);
};

export const useScrollStickySides = <T extends HTMLElement | CustomScrollbarsTypes.Scrollbars>(
  bodyRef: React.RefObject<T>,
  updateByProps: unknown[] = []
): [isHeaderSticky: boolean, isFooterSticky: boolean] => {
  const [isHeaderSticky, toggleHeaderSticky] = useToggle(false);
  const [isFooterSticky, toggleFooterSticky] = useToggle(false);

  const cache = useCache({ isHeaderSticky, isFooterSticky });

  const onScroll = React.useCallback(() => {
    const { current } = bodyRef;

    if (!current) {
      return;
    }

    // eslint-disable-next-line xss/no-mixed-html
    const { scrollTop, clientHeight, scrollHeight } = isScrollbars(current) ? current.getValues() : (current as HTMLElement);

    if (xor(!!scrollTop, cache.current.isHeaderSticky)) {
      toggleHeaderSticky();
    }

    const isScrollExists = scrollHeight > clientHeight;
    const clientHeightWithScrollTop = clientHeight + scrollTop;

    if (isScrollExists ? xnor(clientHeightWithScrollTop >= scrollHeight, cache.current.isFooterSticky) : cache.current.isFooterSticky) {
      toggleFooterSticky();
    }
  }, [cache]);

  React.useEffect(() => {
    onScroll();

    // eslint-disable-next-line xss/no-mixed-html
    const scrollNode = isScrollbars(bodyRef.current) ? bodyRef.current.view : (bodyRef.current as HTMLElement | null);

    scrollNode?.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      scrollNode?.removeEventListener('scroll', onScroll);
    };
  }, updateByProps);

  return [isHeaderSticky, isFooterSticky];
};

export const useScrollNodeIntoView = <Elm extends Element>(): [
  ref: React.RefObject<Elm>,
  scrollIntoView: (options?: ScrollIntoViewOptions) => void
] => {
  const ref = React.useRef<Elm>(null);

  return [ref, (options) => ref.current?.scrollIntoView(options)];
};

export const useAutoScrollNodeIntoView = <Elm extends Element>(
  { options, condition }: { options?: ScrollIntoViewOptions; condition?: boolean },
  deps: unknown[] = []
): [ref: React.RefObject<Elm>, scrollIntoView: (options?: ScrollIntoViewOptions) => void] => {
  const [ref, scrollIntoView] = useScrollNodeIntoView<Elm>();

  React.useEffect(() => {
    if (condition) {
      scrollIntoView(options);
    }
  }, deps);

  return [ref, scrollIntoView];
};

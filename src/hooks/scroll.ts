import React from 'react';

import { ScrollContext } from '@/contexts';
import { getOffsetLeftToNode, getOffsetToNode, scrollTo, setScrollbarOffset } from '@/utils/dom';
import { xnor, xor } from '@/utils/logic';

import { useContextApi } from './cache';
import { useToggle } from './toggle';

export const useScrollHelpers = <B extends HTMLElement, I extends HTMLElement>({
  enableScrollbarOffset,
}: { enableScrollbarOffset?: boolean } = {}) => {
  const bodyRef = React.useRef<B>(null);
  const innerRef = React.useRef<I>(null);

  const scrollHelpers = React.useRef({
    scrollToNode(node: HTMLElement, padding = 0) {
      const offset = getOffsetToNode(node, bodyRef.current);

      scrollTo(bodyRef.current, { top: offset - padding });
    },

    setScrollBarOffset() {
      if (enableScrollbarOffset) {
        requestAnimationFrame(() => setScrollbarOffset(bodyRef.current, innerRef.current));
      }
    },

    scrollHorizontalToNode(node: HTMLElement, padding = 0) {
      const offset = getOffsetLeftToNode(node, bodyRef.current);

      scrollTo(bodyRef.current, { left: offset - padding });
    },
  });

  React.useEffect(() => {
    scrollHelpers.current.setScrollBarOffset();
  });

  return useContextApi({
    bodyRef,
    innerRef,
    scrollHelpers: scrollHelpers.current,
  });
};

export const useScrollContext = () => React.useContext(ScrollContext);

export const useHorizontalScrollToNode = <T extends HTMLElement>(
  ref: React.RefObject<T>,
  condition?: boolean,
  recallEffectFields: unknown[] = []
) => {
  const { scrollHorizontalToNode } = React.useContext(ScrollContext)!;

  React.useEffect(() => {
    if (!condition || !ref.current) {
      return;
    }

    scrollHorizontalToNode(ref.current);
  }, recallEffectFields);

  return scrollHorizontalToNode;
};

export const useScrollShadows = <T extends HTMLElement>(bodyRef: React.RefObject<T>, updateByProps: unknown[] = []) => {
  const [isHeaderShadowShown, toggleHeaderShadowShown] = useToggle(false);
  const [isFooterShadowShown, toggleFooterShadowShown] = useToggle(false);

  const onScroll = React.useCallback(() => {
    const aRef = requestAnimationFrame(() => {
      if (!bodyRef.current) {
        return;
      }

      const {
        current: { scrollTop, clientHeight, scrollHeight },
      } = bodyRef;

      if (xor(!!scrollTop, isHeaderShadowShown)) {
        toggleHeaderShadowShown();
      }

      const isScrollExists = scrollHeight > clientHeight;
      const clientHeightWithScrollTop = clientHeight + scrollTop;

      if (isScrollExists ? xnor(clientHeightWithScrollTop === scrollHeight, isFooterShadowShown) : isFooterShadowShown) {
        toggleFooterShadowShown();
      }
    });

    return () => cancelAnimationFrame(aRef);
  }, [isHeaderShadowShown, isFooterShadowShown]);

  React.useEffect(onScroll, updateByProps);

  return [onScroll, isHeaderShadowShown, isFooterShadowShown] as const;
};

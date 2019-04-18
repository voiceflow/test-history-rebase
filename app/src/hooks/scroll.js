import { useRef, useEffect, useContext, useCallback } from 'react';

import { scrollTo, getOffsetToNode, getOffsetLeftToNode, setScrollbarOffset } from '../utils/dom';

import { ScrollContext } from '../contexts';

import { useToggle } from './toggle';

export const useScrollHelpers = ({ enableScrollbarOffset } = {}) => {
  const bodyRef = useRef(null);
  const innerRef = useRef(null);

  const scrollHelpers = useRef({
    scrollToNode(node, padding = 0) {
      const offset = getOffsetToNode(node, bodyRef.current);

      scrollTo(bodyRef.current, { top: offset - padding });
    },

    setScrollBarOffset() {
      enableScrollbarOffset &&
        requestAnimationFrame(() => setScrollbarOffset(bodyRef.current, innerRef.current));
    },

    scrollHorizontalToNode(node, padding = 0) {
      const offset = getOffsetLeftToNode(node, bodyRef.current);

      scrollTo(bodyRef.current, { left: offset - padding });
    },
  });

  useEffect(() => {
    scrollHelpers.current.setScrollBarOffset();
  });

  return {
    bodyRef,
    innerRef,
    scrollHelpers: scrollHelpers.current,
  };
};

export const useScrollContext = () => useContext(ScrollContext);

export const useHorizontalScrollToNode = (ref, condition, recallEffectFields) => {
  const { scrollHorizontalToNode } = useContext(ScrollContext);

  useEffect(() => {
    if (!condition || !ref.current) {
      return;
    }

    scrollHorizontalToNode(ref.current);
  }, recallEffectFields);

  return scrollHorizontalToNode;
};

export const useScrollShadows = (bodyRef, updateByProps = []) => {
  const [isHeaderShadowShown, toggleHeaderShadowShown] = useToggle(false);
  const [isFooterShadowShown, toggleFooterShadowShown] = useToggle(false);

  const onScroll = useCallback(
    () => {
      const aRef = requestAnimationFrame(() => {
        if (!bodyRef.current) {
          return;
        }

        const {
          current: { scrollTop, clientHeight, scrollHeight },
        } = bodyRef;

        if (scrollTop && !isHeaderShadowShown) {
          toggleHeaderShadowShown();
        } else if (!scrollTop && isHeaderShadowShown) {
          toggleHeaderShadowShown();
        }

        const isScrollExists = scrollHeight > clientHeight;
        const clientHeightWithScrollTop = clientHeight + scrollTop;

        if (!isScrollExists && isFooterShadowShown) {
          toggleFooterShadowShown();
        } else if (
          isScrollExists &&
          clientHeightWithScrollTop === scrollHeight &&
          isFooterShadowShown
        ) {
          toggleFooterShadowShown();
        } else if (
          isScrollExists &&
          clientHeightWithScrollTop !== scrollHeight &&
          !isFooterShadowShown
        ) {
          toggleFooterShadowShown();
        }
      });

      return () => cancelAnimationFrame(aRef);
    },
    [isHeaderShadowShown, isFooterShadowShown]
  );

  useEffect(onScroll, updateByProps);

  return [onScroll, isHeaderShadowShown, isFooterShadowShown];
};

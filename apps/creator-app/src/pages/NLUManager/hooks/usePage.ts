import { useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';
import { FixedSizeList, ListOnScrollProps } from 'react-window';

const usePage = (activeItemID: string | null) => {
  const [isScrolling, setIsScrolling] = React.useState(false);
  const tableRef = React.useRef<HTMLDivElement>(null);
  const virtualScrollRef = React.useRef<FixedSizeList>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setIsScrolling(e.currentTarget.scrollTop > 0);
  };

  const handleVirtualScroll = ({ scrollOffset }: ListOnScrollProps) => {
    setIsScrolling(scrollOffset > 0);
  };

  const scrollToTop = () => {
    if (virtualScrollRef.current) {
      virtualScrollRef.current.scrollTo(0);
    } else {
      tableRef.current?.scrollTo({ top: 0, left: 0 });
    }
  };

  useDidUpdateEffect(() => {
    setIsScrolling(false);
  }, [activeItemID]);

  return { tableRef, isScrolling, setIsScrolling, handleScroll, scrollToTop, handleVirtualScroll, virtualScrollRef };
};

export default usePage;

import { useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

const usePage = (activeItemID: string | null) => {
  const [isScrolling, setIsScrolling] = React.useState(false);
  const tableRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setIsScrolling(e.currentTarget.scrollTop > 0);
  };

  const scrollToTop = () =>
    tableRef.current &&
    tableRef.current.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });

  useDidUpdateEffect(() => {
    setIsScrolling(false);
  }, [activeItemID]);

  return { tableRef, isScrolling, setIsScrolling, handleScroll, scrollToTop };
};

export default usePage;

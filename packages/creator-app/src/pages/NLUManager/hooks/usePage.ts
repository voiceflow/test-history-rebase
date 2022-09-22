import { useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

const usePage = (activeItemID: string | null) => {
  const [isScrolling, setIsScrolling] = React.useState(false);

  useDidUpdateEffect(() => {
    setIsScrolling(false);
  }, [activeItemID]);

  return { isScrolling, setIsScrolling };
};

export default usePage;

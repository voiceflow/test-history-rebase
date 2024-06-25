import { CollapsibleList, useScrollContext } from '@voiceflow/ui-next';
import React, { useLayoutEffect } from 'react';

import { footer } from './CMSFormCollapsibleList.css';
import type { ICMSFormCollapsibleList } from './CMSFormCollapsibleList.interface';

export const CMSFormCollapsibleList = <Item extends { id: string }>({
  overscan = 5,
  getItemKey = (item) => item.id,
  stickyFooter = true,
  autoScrollToTopRevision,
  ...props
}: ICMSFormCollapsibleList<Item>): React.ReactElement => {
  const scroll = useScrollContext();

  useLayoutEffect(() => {
    if (!autoScrollToTopRevision) return;

    scroll.scrollNode?.scrollTo({ top: 0 });
  }, [autoScrollToTopRevision]);

  return (
    <CollapsibleList
      {...props}
      overscan={overscan}
      getItemKey={getItemKey}
      stickyFooter={stickyFooter}
      footerClassName={footer}
    />
  );
};

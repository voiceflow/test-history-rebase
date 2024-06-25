import { tid } from '@voiceflow/style';
import { EmptyPage } from '@voiceflow/ui-next';
import { useAtomValue, useSetAtom, useStore } from 'jotai';
import React from 'react';

import { EMPTY_TEST_ID } from '../../AssistantCMS.constant';
import { useCMSManager } from '../../contexts/CMSManager';
import { container } from './CMSEmpty.css';
import type { ICMSEmpty } from './CMSEmpty.interface';

export const CMSEmpty: React.FC<ICMSEmpty> = ({
  button: buttonProps,
  children,
  searchTitle,
  illustration,
  ...props
}) => {
  const store = useStore();
  const cmsManager = useCMSManager();

  const isEmpty = useAtomValue(cmsManager.isEmpty);
  const setSearch = useSetAtom(cmsManager.originalSearch);
  const isSearchEmpty = useAtomValue(cmsManager.isSearchEmpty);

  if (isSearchEmpty) {
    return (
      <div className={container}>
        <EmptyPage
          title={searchTitle}
          button={{
            label: 'Clear filters',
            variant: 'secondary',
            onClick: () => setSearch(''),
            testID: tid(EMPTY_TEST_ID, 'clear-filters'),
          }}
          description="Based on your search we couldn’t find any matching content."
          illustration={illustration}
          testID={EMPTY_TEST_ID}
        />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={container}>
        <EmptyPage
          {...props}
          button={
            buttonProps
              ? { ...buttonProps, onClick: () => buttonProps?.onClick(store.get(cmsManager.originalSearch)) }
              : undefined
          }
          linkTarget="_blank"
          illustration={illustration}
          testID={EMPTY_TEST_ID}
        />
      </div>
    );
  }

  return <>{children}</>;
};

import { EmptyPage } from '@voiceflow/ui-next';
import { useAtomValue, useStore } from 'jotai';
import React from 'react';

import { useCMSManager } from '../../contexts/CMSManager';
import { container } from './CMSEmpty.css';
import type { ICMSEmpty } from './CMSEmpty.interface';

export const CMSEmpty: React.FC<ICMSEmpty> = ({ button: buttonProp, children, searchTitle, ...props }) => {
  const store = useStore();
  const cmsManager = useCMSManager();

  const isEmpty = useAtomValue(cmsManager.isEmpty);
  const isSearchEmpty = useAtomValue(cmsManager.isSearchEmpty);

  const onButtonClick = () => {
    const search = store.get(cmsManager.originalSearch);

    buttonProp?.onClick(search);
  };

  const button = buttonProp ? { ...buttonProp, onClick: onButtonClick } : undefined;

  if (isSearchEmpty) {
    return (
      <div className={container}>
        <EmptyPage {...props} button={button} title={searchTitle} />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={container}>
        <EmptyPage {...props} button={button} />
      </div>
    );
  }

  return <>{children}</>;
};

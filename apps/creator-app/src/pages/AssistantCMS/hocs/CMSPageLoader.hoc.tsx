import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

import { useSelector } from '@/hooks/store.hook';

import { CMSPageLoader } from '../components/CMSPageLoader.component';

interface IWithCMSPageLoader {
  selector: (state: any) => boolean;
}

export const withCMSPageLoader =
  ({ selector }: IWithCMSPageLoader) =>
  (Component: React.FC) =>
    setDisplayName(wrapDisplayName(Component, 'withCMSPageLoader'))(() => {
      const loaded = useSelector(selector);

      return loaded ? <Component /> : <CMSPageLoader />;
    });

import React, { useEffect } from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

import { useDispatch, useSelector } from '@/hooks/store.hook';
import type { AnyThunk } from '@/store/types';

import { CMSPageLoader } from '../components/CMSPageLoader.component';

interface IWithCMSPageLoader {
  loader?: () => AnyThunk;
  selector: (state: any) => boolean;
}

export const withCMSPageLoader =
  ({ loader, selector }: IWithCMSPageLoader) =>
  (Component: React.FC) =>
    setDisplayName(wrapDisplayName(Component, 'withCMSPageLoader'))(() => {
      const load = useDispatch(loader ?? (() => () => null));

      const loaded = useSelector(selector);

      useEffect(() => {
        if (!loaded) {
          load();
        }
      }, [loaded]);

      return loaded ? <Component /> : <CMSPageLoader />;
    });

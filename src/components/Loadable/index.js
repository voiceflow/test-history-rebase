import React, { lazy, Suspense } from 'react';

import Loader from '../Loader';

export default function Loadable(componentToLoad, text = 'Loading resources...') {
  const Component = lazy(componentToLoad);

  return props => (
    <Suspense fallback={<Loader pending text={text} />}>
      <Component {...props} />
    </Suspense>
  );
}

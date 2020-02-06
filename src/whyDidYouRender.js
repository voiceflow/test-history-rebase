import React from 'react';

import { IS_DEVELOPMENT } from '@/config';

if (IS_DEVELOPMENT) {
  // eslint-disable-next-line global-require
  const whyDidYouRender = require('@welldone-software/why-did-you-render');

  whyDidYouRender(React);
}

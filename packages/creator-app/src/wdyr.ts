/* eslint-disable import/no-extraneous-dependencies, @typescript-eslint/triple-slash-reference */
/// <reference types="@welldone-software/why-did-you-render" />

import wdyr from '@welldone-software/why-did-you-render';
import * as React from 'react';

if (import.meta.env.DEV && import.meta.env.VF_APP_ENABLE_WHY_DID_YOU_RENDER === 'true') {
  wdyr(React as any);
}

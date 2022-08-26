import type { WhyDidYouRenderOptions } from '@welldone-software/why-did-you-render';
import React from 'react';

export const wdyr = <T extends React.ComponentType<any>>(Component: T, options?: WhyDidYouRenderOptions): T => {
  if (!import.meta.env.DEV) {
    throw new Error('this hock must be used only in development mode');
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line no-param-reassign
  Component.whyDidYouRender = options ?? true;

  return Component;
};

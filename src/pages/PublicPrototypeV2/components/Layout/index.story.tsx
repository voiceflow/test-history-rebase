import React from 'react';

import { createGlobalStyle } from '@/hocs';

import Layout, { LayoutProps } from '.';

const GlobalStyles = createGlobalStyle`
  body {
    height: 100%;
  }

  #root {
    width: 100%;
    height: 100%;
  }
`;

export default {
  title: 'PublicPrototype/Layout',
  component: Layout,
};

const createStory = ({ children, ...props }: Partial<LayoutProps> = {}) => (
  <>
    <GlobalStyles />

    <Layout isVisuals={false} renderSplashScreen={() => 'splash screen'} splashScreenPassed={false} renderVisualsFooter={() => 'footer'} {...props}>
      {children ?? (() => 'children')}
    </Layout>
  </>
);

export const basic = () => createStory();
export const splashScreenPassed = () => createStory({ splashScreenPassed: true });
export const visuals = () => createStory({ isVisuals: true });
export const visualsSplashScreenPassed = () => createStory({ isVisuals: true, splashScreenPassed: true, isListening: true });

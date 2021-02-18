import _throttle from 'lodash/throttle';
import React from 'react';

import Box from '@/components/Box';
import { isMobile as isMobileDevice } from '@/config';
import { useHotKeys, useSetup, useToggle } from '@/hooks';
import { Hotkey } from '@/keymap';

import { Container, ContentContainer, FooterContainer, VisualsBorder } from './components';

const MAX_MOBILE_WIDTH = 720;

type RendererOptions = {
  isMobile: boolean;
  isVisuals: boolean;
  isFullScreen: boolean;
  toggleFullScreen: (value?: unknown) => void;
  splashScreenPassed: boolean;
};

export type LayoutProps = {
  children: (options: RendererOptions) => React.ReactNode;
  isVisuals: boolean;
  isListening?: boolean;
  renderSplashScreen: (options: RendererOptions) => React.ReactNode;
  splashScreenPassed: boolean;
  renderVisualsFooter?: (options: RendererOptions) => React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children, isVisuals, isListening, renderSplashScreen, splashScreenPassed, renderVisualsFooter }) => {
  const [isMobileSize, toggleIsMobileSize] = useToggle(window.innerWidth <= MAX_MOBILE_WIDTH);
  const [isFullScreen, toggleFullScreen] = useToggle(false);

  useHotKeys(Hotkey.PROTOTYPE_CLOSE_FULL_SCREEN, () => toggleFullScreen(false));

  useSetup(() => {
    const onResize = _throttle(() => toggleIsMobileSize(window.innerWidth <= MAX_MOBILE_WIDTH), 100);

    window.addEventListener('resize', onResize);

    onResize();

    return () => window.removeEventListener('resize', onResize);
  });

  const isMobile = isMobileSize || isMobileDevice;

  const rendererOptions: RendererOptions = {
    isMobile,
    isVisuals,
    isFullScreen,
    toggleFullScreen,
    splashScreenPassed,
  };

  return (
    <Container isMobile={isMobile} isVisuals={isVisuals} isFullScreen={isFullScreen} splashScreenPassed={splashScreenPassed}>
      <ContentContainer isMobile={isMobile} isVisuals={isVisuals} isFullScreen={isFullScreen} splashScreenPassed={splashScreenPassed}>
        {isVisuals || isMobile ? (
          <Box width="100%" height="100%">
            {!splashScreenPassed ? renderSplashScreen(rendererOptions) : children(rendererOptions)}
          </Box>
        ) : (
          <>
            <Box width="40%" height="100%" borderRight="1px solid  #dfe3ed;">
              {renderSplashScreen(rendererOptions)}
            </Box>

            <Box width="60%" height="100%">
              {children(rendererOptions)}
            </Box>
          </>
        )}
      </ContentContainer>

      {isVisuals && splashScreenPassed && !isMobile && renderVisualsFooter && (
        <FooterContainer isHidden={isFullScreen}>{renderVisualsFooter(rendererOptions)}</FooterContainer>
      )}

      {isVisuals && splashScreenPassed && <VisualsBorder isActive={isListening} />}
    </Container>
  );
};

export default Layout;

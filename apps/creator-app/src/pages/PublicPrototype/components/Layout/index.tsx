import { Box, IS_IOS, IS_MOBILE, SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

import { PrototypeLayout } from '@/constants/prototype';
import { useHotkey, useRAF, useToggle } from '@/hooks';
import { Hotkey } from '@/keymap';

import { Container, ContentContainer, FooterContainer, VisualsBorder } from './components';

const MAX_MOBILE_WIDTH = 720;

interface RendererOptions {
  isMobile: boolean;
  isVisuals: boolean;
  isFullScreen: boolean;
  toggleFullScreen: (value?: unknown) => void;
  splashScreenPassed: boolean;
}

export interface LayoutProps {
  layout: PrototypeLayout;
  children: (options: RendererOptions) => React.ReactNode;
  isVisuals: boolean;
  isListening?: boolean;
  renderSplashScreen: (options: RendererOptions) => React.ReactNode;
  splashScreenPassed: boolean;
  renderVisualsFooter?: (options: RendererOptions) => React.ReactNode;
  colorScheme?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  isVisuals,
  isListening,
  renderSplashScreen,
  splashScreenPassed,
  renderVisualsFooter,
  layout,
  colorScheme,
}) => {
  const [resizeScheduler] = useRAF();
  const [scrollScheduler] = useRAF();
  const [isFullScreen, toggleFullScreen] = useToggle(false);
  const [isMobileSize, toggleIsMobileSize] = useToggle(window.innerWidth <= MAX_MOBILE_WIDTH);

  const isMobile = isMobileSize || IS_MOBILE;
  const isDesktopVisualsScreen = isVisuals && !isMobile && splashScreenPassed;

  useHotkey(Hotkey.PROTOTYPE_CLOSE_FULL_SCREEN, () => toggleFullScreen(false), { disable: !isDesktopVisualsScreen });
  useHotkey(Hotkey.PROTOTYPE_FULL_SCREEN_TOGGLE, () => toggleFullScreen(), { disable: !isDesktopVisualsScreen });

  React.useEffect(() => {
    const root = window.document.getElementById('root')!;

    const onResize = () => {
      resizeScheduler(() => toggleIsMobileSize(window.innerWidth <= MAX_MOBILE_WIDTH));
    };

    const onScrollIOS = () => {
      scrollScheduler(() => {
        if (root.getBoundingClientRect().top < 0) {
          root.style.top = `initial`;
          root.style.height = `${window.innerHeight}px`;
        } else {
          root.style.top = '';
          root.style.height = '';
        }
      });
    };

    onResize();

    window.addEventListener('resize', onResize);

    // on ios scroll event will be fired, even if the root element is not scrollable, when keyboard is opened
    // so the viewport doesn't change height, but the element position is changed
    if (IS_IOS) {
      window.addEventListener('scroll', onScrollIOS);
    }

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScrollIOS);
    };
  }, []);

  const rendererOptions: RendererOptions = {
    isMobile,
    isVisuals,
    isFullScreen,
    toggleFullScreen,
    splashScreenPassed,
  };

  return (
    <Container isMobile={isMobile} isVisuals={isVisuals} isFullScreen={isFullScreen} splashScreenPassed={splashScreenPassed}>
      {layout !== PrototypeLayout.TEXT_DIALOG && isMobile ? (
        <Box.FlexCenter width="100%" height="100%" column p={32}>
          <SvgIcon icon="info" color="#e5b813" size={32} />
          <Box mt={16} textAlign="center">
            <Text fontSize={22}>Mobile support for prototypes is coming soon. Please test on desktop.</Text>
          </Box>
        </Box.FlexCenter>
      ) : (
        <>
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

          {isVisuals && splashScreenPassed && <VisualsBorder isActive={isListening} colorScheme={colorScheme} />}
        </>
      )}
    </Container>
  );
};

export default Layout;

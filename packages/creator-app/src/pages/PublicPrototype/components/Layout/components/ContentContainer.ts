import { css, styled } from '@/hocs/styled';

import { FOOTER_HEIGHT } from './FooterContainer';

interface ContentContainerProps {
  isMobile?: boolean;
  isVisuals?: boolean;
  isFullScreen?: boolean;
  splashScreenPassed?: boolean;
}

const MARGIN = 48;

const ContentContainer = styled.div<ContentContainerProps>`
  position: relative;

  ${({ isMobile }) =>
    isMobile &&
    css`
      width: 100%;
      height: 100%;
    `};

  ${({ isMobile, isVisuals, isFullScreen, splashScreenPassed }) =>
    !isMobile &&
    isVisuals &&
    (splashScreenPassed
      ? css`
          width: ${isFullScreen ? '100%' : `calc(100% - ${MARGIN * 2}px)`};
          height: ${isFullScreen ? '100%' : `calc(100% - ${MARGIN * 2 + FOOTER_HEIGHT}px)`};
          margin: ${isFullScreen ? 0 : MARGIN}px;
          margin-bottom: ${isFullScreen ? 0 : MARGIN + FOOTER_HEIGHT}px;
        `
      : css`
          width: 350px;
          height: calc(100% - ${MARGIN * 2}px);
          margin: ${MARGIN}px;
        `)};

  ${({ isMobile, isVisuals }) =>
    !isMobile &&
    !isVisuals &&
    css`
      display: flex;
      width: calc(100% - ${MARGIN * 2}px);
      height: calc(100% - ${MARGIN * 2}px);
      margin: ${MARGIN}px;
      max-width: 1100px;
      max-height: 804px;
      box-shadow: 0 8px 16px 0 rgba(17, 49, 96, 0.08), 0 0 0 1px rgba(17, 49, 96, 0.06);
      border-radius: 12px;
      overflow: hidden;
      background-color: #fff;
    `};
`;

export default ContentContainer;

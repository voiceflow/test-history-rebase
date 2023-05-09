import Box from '@ui/components/Box';
import { css, keyframes, styled, units } from '@ui/styles';
import { ANIMATION_SPEED } from '@ui/styles/constants';
import { TransitionStatus } from 'react-transition-group';

export interface ContainerProps {
  status: TransitionStatus;
  animated: boolean;
  centered?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  minHeight?: number;
  fullScreen?: boolean;
  verticalMargin?: number;
  enterAnimation?: boolean;
  hideScrollbar?: boolean;
}

const ShowKeyframe = keyframes`
  from {
    opacity: 0;
    transform: translateY(15px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Container = styled.section<ContainerProps>`
  background: #fff;
  z-index: ${({ theme }) => theme.zIndex.modal};
  pointer-events: all;
  box-shadow: rgb(19 33 68 / 4%) 0px 12px 24px, rgb(19 33 68 / 4%) 0px 8px 12px, rgb(19 33 68 / 2%) 0px 4px 4px, rgb(19 33 68 / 1%) 0px 2px 2px,
    rgb(19 33 68 / 1%) 0px 1px 1px, rgb(17 49 96 / 3%) 0px 0px 0px;

  ${({ centered, maxWidth = 500, minHeight, maxHeight, fullScreen, verticalMargin = 28 }) =>
    fullScreen
      ? css`
          height: 100%;
          width: 100%;
          max-height: 100%;
          max-width: 100%;
          overflow: hidden;
          padding: 0;
          margin: 0;
          border-radius: 0;
        `
      : css`
          width: 100%;
          border-radius: 8px;
          margin: ${centered ? 'auto' : `${verticalMargin}px auto;`};
          max-width: ${maxWidth}px;
          min-height: ${minHeight ? `${minHeight}px` : ''};
          max-height: ${maxHeight ? `${maxHeight}px` : 'calc(100% - 56px)'};
          overflow-x: hidden;
          overflow-y: auto;

          @media (max-width: 576px) {
            left: 0;
            top: 0;
            margin: 0.5em auto;
            max-width: unset;
            width: calc(100% - 1rem);
          }
        `};

  ${({ hideScrollbar }) =>
    hideScrollbar &&
    css`
      /* Hide scrollbar for Chrome, Safari and Opera */
      ::-webkit-scrollbar {
        display: none;
      }

      /* Hide scrollbar for IE, Edge and Firefox */
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */
    `}

  ${({ status, animated, enterAnimation }) => {
    if (!animated) return null;

    switch (status) {
      case 'entered':
        return (
          enterAnimation &&
          css`
            animation: ${ShowKeyframe} ${ANIMATION_SPEED}s ease-in;
            animation-fill-mode: backwards;
          `
        );

      case 'exiting':
        return css`
          transform: translateY(-15px);
          opacity: 0;
          transition: opacity ${ANIMATION_SPEED}s ease-out, transform ${ANIMATION_SPEED}s ease-out;
        `;
      case 'exited':
        return css`
          opacity: 0;
          transform: translateY(-15px);
        `;
      default:
        return null;
    }
  }}

  & + & {
    margin-top: ${units(3)}px;
  }
`;

export interface RootProps {
  hidden: boolean;
  centered?: boolean;
  fullScreen?: boolean;
}

export const Root = styled.div<RootProps>`
  display: ${({ centered }) => (centered ? 'flex' : 'block')};
  position: fixed;
  padding: ${({ fullScreen }) => (fullScreen ? '0' : '0 0.5rem')};
  width: 100%;
  height: 100%;
  z-index: ${({ theme }) => theme.zIndex.modal};
  overflow-y: auto;
  pointer-events: none;

  ${({ hidden }) =>
    hidden
      ? css`
          width: 0;
          height: 0;
          position: fixed;
          top: 0%;
          left: 0%;
          z-index: -1000;
          opacity: 0;
          overflow: hidden;
          visibility: hidden;
        `
      : css`
          & > * {
            pointer-events: auto;
          }
        `}
`;
export const Body = styled(Box)<{ centred?: boolean }>`
  width: 100%;
  position: relative;

  ${({ centred }) =>
    centred
      ? css`
          padding: ${units(3)}px ${units(4)}px ${units(6)}px ${units(4)}px;
          font-size: 15px;
          line-height: 22px;
          text-align: center;
        `
      : css`
          padding: 0 ${units(4)}px ${units(4)}px ${units(4)}px;
        `}
`;

export const Footer = styled(Box.Flex)<{ sticky?: boolean }>`
  width: 100%;
  justify-content: ${({ justifyContent = 'flex-end' }) => justifyContent};
  padding: ${units(3)}px ${units(4)}px;
  background: ${({ theme }) => theme.backgrounds.gray};
  border-top: 1px solid ${({ theme }) => theme.colors.separatorSecondary};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;

  ${({ sticky = false }) =>
    sticky &&
    css`
      position: sticky;
      bottom: 0;
    `}
`;

const showKeyframes = keyframes`
 from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const hideKeyframes = keyframes`
 from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

export const Backdrop = styled.div<{ closing: boolean; closePrevented?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: ${({ theme }) => theme.zIndex.backdrop};
  background-color: rgba(19, 33, 68, 0.6);
  cursor: ${({ closePrevented }) => (closePrevented ? 'default' : 'pointer')};

  animation: ${({ closing }) => (closing ? hideKeyframes : showKeyframes)} ${ANIMATION_SPEED}s ease-in-out;
  animation-fill-mode: both;
`;

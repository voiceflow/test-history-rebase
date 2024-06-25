import { Tokens } from '@voiceflow/ui-next/styles';

import { css, styled } from '@/hocs/styled';
import { SlideOut, SlideOutDirection } from '@/styles/transitions';

import type { DrawerProps } from '../types';

const Container = styled(SlideOut)<DrawerProps>`
  height: 100%;
  top: 0;
  bottom: 0;
  background-color: #fff;

  z-index: ${({ zIndex = 20 }) => zIndex};

  ${({ open }) =>
    !open &&
    css`
      > * {
        visibility: hidden;
      }
    `}

  ${({ direction = SlideOutDirection.RIGHT }) =>
    direction === SlideOutDirection.RIGHT
      ? css`
          border-right: 1px solid ${({ theme }) => theme.colors.borders};
        `
      : css`
          border-left: 1px solid ${({ theme }) => theme.colors.borders};
        `}

  ${({ overflowHidden }) =>
    overflowHidden &&
    css`
      overflow: hidden;
      overflow: clip;
    `}

  ${({ scrollable }) =>
    scrollable &&
    css`
      overflow-y: scroll;
    `}

  ${({ disableAnimation, animatedWidth }) =>
    !disableAnimation &&
    css`
      transition-duration: ${Tokens.animation.duration.default};
      transition-timing-function: ${Tokens.animation.timingFunction.default};
      transition-property:
        top,
        height ${animatedWidth ? ', transform, width' : ''};
    `}
`;

export default Container;

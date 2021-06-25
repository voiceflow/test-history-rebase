import { SvgIconContainer } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

import { FAN_DIRECTION } from '../constants';

const EMOJI_SIZE = 28;

const determineInitialOffset = (fanDirection: FAN_DIRECTION) => {
  switch (fanDirection) {
    case FAN_DIRECTION.DOWN:
      return 'top: -6px;  right: 27px;';
    case FAN_DIRECTION.LEFT:
      return 'top: -5px;  right: -8px;';
    case FAN_DIRECTION.RIGHT:
      return 'top: -6px;  right: 28px;';
    case FAN_DIRECTION.UP:
      return 'top: 31px;  right: 27px;';
    default:
      return 'top: -6px;  right: -6px;';
  }
};

const determineTransition = (fanDirection: FAN_DIRECTION) => {
  switch (fanDirection) {
    case FAN_DIRECTION.DOWN:
      return 'transition: top 0.15s;';
    case FAN_DIRECTION.LEFT:
      return 'transition: right 0.15s;';
    case FAN_DIRECTION.RIGHT:
      return 'transition: left 0.15s;';
    case FAN_DIRECTION.UP:
      return 'transition: bottom 0.15s;';
    default:
      return 'transition: right 0.15s;';
  }
};

const determineInitialPosition = (fanDirection: FAN_DIRECTION) => {
  switch (fanDirection) {
    case FAN_DIRECTION.DOWN:
      return 'top: 0px;';
    case FAN_DIRECTION.LEFT:
      return 'right: 0px;';
    case FAN_DIRECTION.RIGHT:
      return 'left: 0px;';
    case FAN_DIRECTION.UP:
      return 'bottom: 0px;';
    default:
      return 'right: 0px;';
  }
};

const determineFinalPosition = (fanDirection: FAN_DIRECTION, number: number) => {
  switch (fanDirection) {
    case FAN_DIRECTION.DOWN:
      return `top: ${(number + 1) * EMOJI_SIZE}px;`;
    case FAN_DIRECTION.LEFT:
      return `right: ${(number + 1) * EMOJI_SIZE}px;`;
    case FAN_DIRECTION.RIGHT:
      return `left: ${(number + 1) * EMOJI_SIZE}px;`;
    case FAN_DIRECTION.UP:
      return `bottom: ${(number + 1) * EMOJI_SIZE}px;`;
    default:
      return `right: ${(number + 1) * EMOJI_SIZE}px;`;
  }
};

export const Option = styled.div<{ fanDirection: FAN_DIRECTION; number: number; isHovering: boolean }>`
  ${({ fanDirection }) =>
    css`
      ${determineTransition(fanDirection)}
    `}
  position: absolute;
  transition-timing-function: linear, cubic-bezier(0.32, 1.85, 0.54, 1.85);
  ${({ fanDirection }) =>
    css`
      ${determineInitialPosition(fanDirection)}
    `}
  padding: 6px;
  pointer-events: none;
  opacity: 0.6;
  :hover {
    transition: all 0.2s ease;
    transition-delay: 0.15ms;
    transform: scale(1.3);
    opacity: 1;
  }
  ${({ number, isHovering, fanDirection }) =>
    isHovering &&
    css`
      ${determineFinalPosition(fanDirection, number)}
    `}
`;

export const OptionsContainer = styled.div<{ fanDirection: FAN_DIRECTION; length: number }>`
  position: absolute;
  ${({ fanDirection }) =>
    css`
      ${determineInitialOffset(fanDirection)}
    `}
`;

export const Container = styled.div`
  cursor: pointer;
  position: relative;
  :hover {
    ${Option} {
      pointer-events: auto;
    }
  }
`;

export const PlaceholderContainer = styled.div<{ isPlaceholder: boolean }>`
  z-index: 2;
  position: relative;
  background: white;
  border-radius: 50%;
  height: 21px;
  width: 21px;
  ${({ isPlaceholder }) =>
    !isPlaceholder
      ? css`
          top: 1px;
        `
      : css`
          ${SvgIconContainer} {
            position: relative;
            right: 2px;
          }
        `}
`;

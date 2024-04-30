import { keyframes } from '@/styles';

export const moveInKeyframesFactory = (x: number, y: number) => keyframes`
 from {
    translate: ${x}px ${y}px;
  }

  to {
    translate: 0px 0px;
  }
`;

export const moveInYKeyframesFactory = (distance = -10) => moveInKeyframesFactory(0, distance);

export const moveInXKeyframesFactory = (distance = 16) => moveInKeyframesFactory(distance, 0);

export const moveInTopKeyframes = moveInYKeyframesFactory();
export const moveInLeftKeyframes = moveInXKeyframesFactory();

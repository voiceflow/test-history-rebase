import { css, keyframes, styled } from '@/hocs';

const FadeKeyframes = (distance = 0, height = 0) => keyframes`
  from {
    transform: translate3d(${distance}px, ${height}px, 0);
    opacity: 0;
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
`;

// eslint-disable-next-line import/prefer-default-export
export const Fade = css`
  animation: ${({ distance, height }) => FadeKeyframes(distance, height)} 180ms ease-in-out;
  animation-fill-mode: both;
`;

export const FadeContainer = styled.div`
  ${Fade}
`;

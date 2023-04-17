import { Flex } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

export const WaveContainer = styled(Flex)<{ playing: boolean }>`
  margin-right: 10px;
  background: transparent;

  & > div {
    position: relative;
    display: inline-block;
    background: #5d9df5;
    height: 8px;
    width: 3px;
    border-radius: 50px;
    margin-right: 3px;
    -webkit-animation: load 4s ease-in-out infinite;
    animation: load 4s ease-in-out infinite;

    ${({ playing }) =>
      playing
        ? css`
            animation-play-state: running;
          `
        : css`
            background: #8f8e93 !important;
            animation-play-state: paused;
          `}
  }

  & > .rectangle-2 {
    -webkit-animation-delay: 0.1s;
    animation-delay: 0.1s;
  }

  & > .rectangle-3 {
    -webkit-animation-delay: 0.3s;
    animation-delay: 0.3s;
  }

  & > .rectangle-4 {
    -webkit-animation-delay: 0.5s;
    animation-delay: 0.5s;
  }

  & > .rectangle-5 {
    -webkit-animation-delay: 0.7s;
    animation-delay: 0.7s;
  }

  & > .rectangle-6 {
    -webkit-animation-delay: 1s;
    animation-delay: 1s;
  }

  @-moz-keyframes load {
    0%,
    100% {
      -moz-transform: scaleY(1);
      background: #5d9df5;
    }
    16.67% {
      -moz-transform: scaleY(2.3);
      background: #5d9df5;
    }
    33.33% {
      -moz-transform: scaleY(1);
      background: #5d9df5;
    }
    50% {
      -moz-transform: scaleY(2.3);
      background: #5d9df5;
    }
    66.67% {
      -moz-transform: scaleY(1);
      background: #5d9df5;
    }
    83.34% {
      -moz-transform: scaleY(2.3);
      background: #5d9df5;
    }
  }

  @-webkit-keyframes load {
    0%,
    100% {
      -webkit-transform: scaleY(1);
      background: #5d9df5;
    }
    16.67% {
      -webkit-transform: scaleY(2.3);
      background: #5d9df5;
    }
    33.33% {
      -webkit-transform: scaleY(1);
      background: #5d9df5;
    }
    50% {
      -webkit-transform: scaleY(2.3);
      background: #5d9df5;
    }
    66.67% {
      -webkit-transform: scaleY(1);
      background: #5d9df5;
    }
    83.34% {
      -webkit-transform: scaleY(2.3);
      background: #5d9df5;
    }
  }

  @keyframes load {
    0%,
    100% {
      transform: scaleY(1);
      background: #5d9df5;
    }
    16.67% {
      transform: scaleY(2.3);
      background: #5d9df5;
    }
    33.33% {
      transform: scaleY(1);
      background: #5d9df5;
    }
    50% {
      transform: scaleY(2.3);
      background: #5d9df5;
    }
    66.67% {
      transform: scaleY(1);
      background: #5d9df5;
    }
    83.34% {
      transform: scaleY(2.3);
      background: #5d9df5;
    }
  }
`;

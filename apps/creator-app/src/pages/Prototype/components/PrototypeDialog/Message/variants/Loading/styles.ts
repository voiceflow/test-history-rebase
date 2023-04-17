import { css, styled } from '@/hocs/styled';

import BaseMessage from '../../Base';

export const Container = styled(BaseMessage)<{ isLoading?: boolean }>`
  ${BaseMessage.Bubble} {
    width: 70px;
    animation: 1.6s heartbeat infinite ease-out;
  }

  ${({ isLoading }) =>
    !isLoading &&
    css`
      display: none;
    `}

  // https://codepen.io/nzbin/pen/GGrXbp
  .dot-falling {
    position: relative;
    left: -9984px;
    top: 6px;
    width: 7px;
    height: 7px;
    border-radius: 5px;
    animation: dotFalling 0.8s infinite alternate;
    animation-delay: 0.25s;
  }

  .dot-falling::before,
  .dot-falling::after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
  }

  .dot-falling::before {
    width: 7px;
    height: 7px;
    border-radius: 5px;
    animation: dotFallingBefore 0.8s infinite alternate;
    animation-delay: 0s;
  }

  .dot-falling::after {
    width: 7px;
    height: 7px;
    border-radius: 5px;
    animation: dotFallingAfter 0.8s infinite alternate;
    animation-delay: 0.5s;
  }

  @keyframes dotFalling {
    0% {
      box-shadow: 9999px 0 0 0 #8f8e94;
    }
    100% {
      box-shadow: 9999px 0 0 0 #e5e4ec;
    }
  }

  @keyframes dotFallingBefore {
    0% {
      box-shadow: 9988px 0 0 0 #8f8e94;
    }
    100% {
      box-shadow: 9988px 0 0 0 #e5e4ec;
    }
  }

  @keyframes dotFallingAfter {
    0% {
      box-shadow: 10010px 0 0 0 #8f8e94;
    }
    100% {
      box-shadow: 10010px 0 0 0 #e5e4ec;
    }
  }

  @keyframes heartbeat {
    50% {
      transform: scale(1.05);
    }
  }
`;

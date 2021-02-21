import React from 'react';

import { css, styled } from '@/hocs';

import { Message } from '../components';
import Bubble from '../components/MessageBubble';

const Component = styled(Message)<{ isLoading?: boolean }>`
  ${Bubble} {
    width: 70px;
  }

  ${({ isLoading }) =>
    !isLoading &&
    css`
      display: none;
    `}

  .dot-flashing {
    position: relative;
    width: 8px;
    height: 8px;
    border-radius: 5px;
    background-color: #8f8e94;
    color: #8f8e94;
    animation: dotFlashing 0.8s infinite linear alternate;
    animation-delay: 0.25s;
    left: 14px;
    top: 7px;
  }

  .dot-flashing::before,
  .dot-flashing::after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
  }

  .dot-flashing::before {
    left: -12px;
    width: 8px;
    height: 8px;
    border-radius: 5px;
    background-color: #8f8e94;
    color: #8f8e94;
    animation: dotFlashing 0.8s infinite alternate;
    animation-delay: 0s;
  }

  .dot-flashing::after {
    left: 12px;
    width: 8px;
    height: 8px;
    border-radius: 5px;
    background-color: #8f8e94;
    color: #8f8e94;
    animation: dotFlashing 0.8s infinite alternate;
    animation-delay: 0.5s;
  }

  @keyframes dotFlashing {
    0% {
      background-color: #8f8e94;
    }
    50%,
    100% {
      background-color: #e5e4ec;
    }
  }
`;

const Loading: React.FC<{ isLoading?: boolean }> = ({ isLoading }) => (
  <Component withLogo isFirstInSeries withAnimation isLoading={isLoading}>
    <div className="dot-flashing"></div>
  </Component>
);

export default Loading;

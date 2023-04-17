import { keyframes, styled } from '@/hocs/styled';

const animation = keyframes`
  from {
    transform: scale(0) translate(-50%, 0);
    opacity: 0.15;
  }
  to {
    transform: scale(1) translate(-50%, 0);
    opacity:1;
  }
`;

const TooltipContainer = styled.div<{ width: number }>`
  width: ${({ width }) => width}px;
  position: relative;
  display: block;
  padding: 8px 16px;
  left: 50%;
  font-size: 13px;
  border-radius: 6px;
  background-color: #33373a;
  perspective: 800px;
  transform-origin: -50% 0;
  animation: ${animation} 0.12s cubic-bezier(0.165, 0.84, 0.44, 1);
  animation-fill-mode: both;
`;

export default TooltipContainer;

import { keyframes, styled } from '@/hocs';
import { ANIMATION_SPEED } from '@/styles/theme';

const fadeIn = keyframes`
  0% { opacity:0; }
  66% { opacity:0; }
  100% { opacity:1; }
`;

export const TooltipContainer = styled.div`
  display: block;
  padding: 12px 4px 4px;
  border-radius: 8px;
  background-color: #33373a;
  margin-left: 25px;
  width: 200px;

  animation: ${fadeIn} 1.5s;
`;

export const TooltipText = styled.div`
  font-size: 13px;
  color: #f2f7f7;
  white-space: initial;
  word-wrap: break-word;
  padding: 0 12px 12px;
`;

export const TooltipButton = styled.div`
  width: 100%;
  padding: 10px 0px;
  border-radius: 6px;
  background-color: #4b5052;
  font-weight: 600;
  text-align: center;
  font-size: 13px;
  color: #f2f7f7;
  pointer-events: auto;
  cursor: pointer;
  transition: all ${ANIMATION_SPEED}s ease;
  &:hover {
    background-color: #5d6264;
  }
  transition-delay: 150ms;
`;

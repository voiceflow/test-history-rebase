import { Text } from '@voiceflow/ui';

import { css, keyframes, styled } from '@/hocs';

export const StyledText = styled(Text)<{ disabled: boolean; isLibrary: boolean }>`
  display: block;
  padding-left: ${({ isLibrary }) => (isLibrary ? 0 : 12)}px;
  width: 100%;
  max-width: 230px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  ${({ disabled }) =>
    disabled &&
    css`
      color: #62778c;
    `}
`;

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

export const TooltipContainer = styled.div`
  max-width: 232px;
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

import { css, styled, transition } from '@/hocs';

export const OutterChatContainer = styled.div`
  position: relative;
  flex: 1;
`;

export const InnerChatContainer = styled.div<{ atTop: boolean }>`
  ${transition('color')}

  overflow: auto;
  height: 100%;
  background: white;
  border-top: 1px solid transparent;

  ${({ atTop }) =>
    !atTop &&
    css`
      border-top: 1px solid #eaeff4;
    `}
`;

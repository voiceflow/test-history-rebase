import { css, styled, transition } from '@/hocs/styled';

import { Container } from '../PrototypeDialog/Message/Base/styles';

export const OutterChatContainer = styled.div<{ focusedTurnID: string | null }>`
  position: relative;
  flex: 1;
  width: 100%;

  ${({ focusedTurnID }) =>
    focusedTurnID &&
    css`
      & ${Container} {
        transition: all 0.15s ease-in-out;
        opacity: 50%;
      }
    `}
`;

export const InnerChatContainer = styled.div<{ atTop: boolean }>`
  ${transition('border-color')}

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

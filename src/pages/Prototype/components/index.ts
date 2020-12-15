import { css, styled, transition } from '@/hocs';

export { default as Reset } from './PrototypeReset';
export { default as Start } from './PrototypeStart';
export { default as Input } from './PrototypeInput';
export { default as Dialog } from './PrototypeDialog';
export { default as Container } from './PrototypeContainer';

export const OutterChatContainer = styled.div`
  position: relative;
  flex: 1;
`;

export const InnerChatContainer = styled.div<{ atTop: boolean }>`
  ${transition()}

  overflow: auto;
  height: 100%;
  background: #fdfdfd;
  border-top: 1px solid transparent;

  ${({ atTop }) =>
    !atTop &&
    css`
      border-top: 1px solid #eaeff4;
    `}
`;

export const UserSaysContainer = styled.div`
  box-shadow: 0 -1px 40px 0 rgba(17, 49, 96, 0.06);
  z-index: 2;
`;

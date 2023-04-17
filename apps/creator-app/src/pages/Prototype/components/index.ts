import { styled } from '@/hocs/styled';

export { default as ChatDisplay } from './PrototypeChatDisplay';
export { default as Container } from './PrototypeContainer';
export { default as Dialog } from './PrototypeDialog';
export { default as Input } from './PrototypeInput';
export { default as Reset } from './PrototypeReset';
export { default as Start } from './PrototypeStart';

export const UserSaysContainer = styled.div`
  box-shadow: 0 -1px 40px 0 rgba(17, 49, 96, 0.06);
  z-index: 2;
`;

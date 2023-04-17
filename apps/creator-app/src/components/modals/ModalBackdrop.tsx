import { Portal, stopImmediatePropagation } from '@voiceflow/ui';
import React from 'react';

import { ModalsContext } from '@/contexts/ModalsContext';
import { styled } from '@/hocs/styled';
import { FadeContainer } from '@/styles/animations';

const Backdrop = styled(FadeContainer)`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: ${({ theme }) => theme.zIndex.backdrop};
  background-color: rgba(19, 33, 68, 0.6);
  cursor: pointer;
`;

interface UncontrolledBackdropProps {
  onClose: VoidFunction;
}

export const UncontrolledBackdrop: React.FC<UncontrolledBackdropProps> = ({ onClose }) => (
  <Portal portalNode={document.body}>
    <Backdrop onPaste={stopImmediatePropagation()} onClick={onClose} />
  </Portal>
);

const ModalBackdrop: React.FC = () => {
  const { openedId, close } = React.useContext(ModalsContext);

  return <>{!!openedId && <UncontrolledBackdrop onClose={() => openedId && close(openedId)} />}</>;
};

export default ModalBackdrop;

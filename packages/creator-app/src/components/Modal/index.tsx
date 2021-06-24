import { IconVariant, Portal, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { ModalType } from '@/constants';
import { useModals } from '@/hooks';

import { Close, Container, Content, Header, Icon, Root } from './components';

export { Body as ModalBody, Footer as ModalFooter, Header as ModalHeader } from './components';

export type ModalProps = {
  id: ModalType;
  title: React.ReactNode;
  icon?: React.ReactNode;
  isSmall?: boolean;
  className?: string;
};

const Modal: React.ForwardRefRenderFunction<HTMLDivElement, ModalProps> = ({ id, title, icon, isSmall = true, children, className }, ref) => {
  const { fade, isOpened, close, isInStack } = useModals(id);

  return !isInStack ? null : (
    <Portal portalNode={document.body}>
      <Root ref={ref} hidden={!isOpened}>
        <Container fade={fade} isSmall={isSmall} className={className}>
          <Header>
            {title}
            <div>
              <Icon>{icon}</Icon>
              <Close>
                <SvgIcon icon="close" variant={IconVariant.STANDARD} clickable size={14} onClick={close} />
              </Close>
            </div>
          </Header>

          <Content>{children}</Content>
        </Container>
      </Root>
    </Portal>
  );
};

export default React.forwardRef<HTMLDivElement, React.PropsWithChildren<ModalProps>>(Modal);

import React from 'react';

import Portal from '@/components/Portal';
import SvgIcon from '@/components/SvgIcon';
import { IconVariant, ModalType } from '@/constants';
import { useModals } from '@/hooks';

import { Container, Content, Header, Root } from './components';

export type ModalProps = {
  id: ModalType;
  title: React.ReactNode;
  isSmall?: boolean;
  className?: string;
};

const Modal: React.FC<ModalProps> = ({ id, title, isSmall = true, children, className }, ref: React.Ref<HTMLDivElement>) => {
  const { fade, isOpened, close, isInStack } = useModals(id);

  // eslint-disable-next-line xss/no-mixed-html
  return !isInStack ? null : (
    <Portal portalNode={document.body}>
      <Root ref={ref} hidden={!isOpened}>
        <Container fade={fade} isSmall={isSmall} className={className}>
          <Header>
            {title}

            <SvgIcon icon="close" variant={IconVariant.STANDARD} clickable size={12} onClick={close} />
          </Header>

          <Content>{children}</Content>
        </Container>
      </Root>
    </Portal>
  );
};

export default React.forwardRef<HTMLDivElement, React.PropsWithChildren<ModalProps>>(Modal);

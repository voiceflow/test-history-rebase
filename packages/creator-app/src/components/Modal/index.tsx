import { Flex, IconVariant, Portal, SvgIcon } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import InfoIcon from '@/components/InfoIcon';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';
import { ClassName } from '@/styles/constants';

import { Close, Container, Header, Icon, Root } from './components';

export { Body as ModalBody, Footer as ModalFooter, Header as ModalHeader } from './components';

export interface ModalProps {
  id: ModalType;
  title: React.ReactNode;
  icon?: React.ReactNode;
  isSmall?: boolean;
  className?: string;
  tooltip?: React.ReactNode;
}

const Modal: React.ForwardRefRenderFunction<HTMLDivElement, ModalProps> = (
  { id, title, icon, isSmall = true, children, className, tooltip },
  ref
) => {
  const { fade, isOpened, close, isInStack } = useModals(id);

  return !isInStack ? null : (
    <Portal portalNode={document.body}>
      <Root ref={ref} hidden={!isOpened}>
        <Container fade={fade} isSmall={isSmall} className={cn(ClassName.MODAL, className, `${ClassName.MODAL}--${id}`)}>
          <Header>
            <Flex as="span">
              {title}
              {tooltip && (
                <span className="ml-2">
                  <InfoIcon tooltipProps={{ portalNode: window.document.body }}>{tooltip}</InfoIcon>
                </span>
              )}
            </Flex>
            <div>
              <Icon>{icon}</Icon>

              <Close>
                <SvgIcon icon="close" variant={IconVariant.STANDARD} clickable size={14} onClick={close} />
              </Close>
            </div>
          </Header>

          <Flex column>{children}</Flex>
        </Container>
      </Root>
    </Portal>
  );
};

export default React.forwardRef<HTMLDivElement, React.PropsWithChildren<ModalProps>>(Modal);

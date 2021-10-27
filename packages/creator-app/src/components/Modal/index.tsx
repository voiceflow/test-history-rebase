import { Box, BoxFlex, IconVariant, Portal, SvgIcon } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import InfoIcon from '@/components/InfoIcon';
import { ModalType } from '@/constants';
import { useModals, useTheme } from '@/hooks';
import { ClassName, Identifier } from '@/styles/constants';

import { Container, Header, Root } from './components';

export { Body as ModalBody, Footer as ModalFooter, Header as ModalHeader } from './components';

export interface UncontrolledModalProps {
  id?: string;
  fade?: boolean;
  title?: React.ReactNode;
  onClose?: VoidFunction;
  isOpened: boolean;
  closable?: boolean;
  centered?: boolean;
  maxWidth?: number;
  className?: string;
  withHeader?: boolean;
  intoTooltip?: React.ReactNode;
  headerActions?: React.ReactNode;
}

export interface ModalProps extends Omit<UncontrolledModalProps, 'fade' | 'isOpened' | 'onClose'> {
  id: ModalType;
}

export const UncontrolledModal = React.forwardRef<HTMLDivElement, React.PropsWithChildren<UncontrolledModalProps>>(
  (
    {
      id,
      fade = true,
      title,
      onClose,
      closable = true,
      centered,
      isOpened,
      maxWidth,
      children,
      className,
      withHeader = true,
      intoTooltip,
      headerActions,
    },
    ref
  ) => {
    const theme = useTheme();

    const nestedTheme = React.useMemo(() => ({ ...theme, zIndex: { ...theme.zIndex, popper: theme.zIndex.modal + 1 } }), [theme]);

    return (
      <ThemeProvider theme={nestedTheme}>
        <Portal portalNode={document.body}>
          <Root ref={ref} hidden={!isOpened} centered={centered}>
            <Container
              fade={fade}
              centered={centered}
              maxWidth={maxWidth}
              className={cn(ClassName.MODAL, className, `${ClassName.MODAL}--${id ?? 'unknown'}`)}
            >
              {withHeader && (
                <Header>
                  <BoxFlex height="100%">
                    <BoxFlex height="100%" id={Identifier.MODAL_TITLE_CONTAINER}>
                      {title}
                    </BoxFlex>

                    {intoTooltip && (
                      <Box ml={8}>
                        <InfoIcon>{intoTooltip}</InfoIcon>
                      </Box>
                    )}
                  </BoxFlex>

                  <BoxFlex height="100%">
                    {headerActions && <BoxFlex mr={16}>{headerActions}</BoxFlex>}

                    {closable && (
                      <SvgIcon
                        id={Identifier.MODAL_CLOSE_BUTTON_REGULAR}
                        icon="close"
                        size={14}
                        variant={IconVariant.STANDARD}
                        onClick={onClose}
                        clickable
                      />
                    )}
                  </BoxFlex>
                </Header>
              )}

              <BoxFlex column>{children}</BoxFlex>
            </Container>
          </Root>
        </Portal>
      </ThemeProvider>
    );
  }
);

const Modal: React.ForwardRefRenderFunction<HTMLDivElement, ModalProps> = ({ id, ...props }, ref) => {
  const { fade, isOpened, close, isInStack } = useModals(id);

  return !isInStack ? null : <UncontrolledModal {...props} id={id} ref={ref} fade={fade} onClose={close} isOpened={isOpened} />;
};

export default React.forwardRef<HTMLDivElement, React.PropsWithChildren<ModalProps>>(Modal);

import { Box, BoxFlex, IconButton, IconButtonVariant, Portal, TutorialInfoIcon } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';
import { ThemeProvider } from 'styled-components';

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
  maxHeight?: number;
  className?: string;
  withHeader?: boolean;
  intoTooltip?: React.ReactNode;
  headerActions?: React.ReactNode;
  headerBorder?: boolean;
  fullScreen?: boolean;
  leftSidebar?: () => React.ReactElement;
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
      headerBorder,
      maxWidth,
      maxHeight,
      children,
      className,
      withHeader = true,
      intoTooltip,
      headerActions,
      leftSidebar,
      fullScreen = false,
    },
    ref
  ) => {
    const theme = useTheme();

    const nestedTheme = React.useMemo(() => ({ ...theme, zIndex: { ...theme.zIndex, popper: theme.zIndex.modal + 1 } }), [theme]);

    return (
      <ThemeProvider theme={nestedTheme}>
        <Portal portalNode={document.body}>
          <Root ref={ref} hidden={!isOpened} centered={centered} fullScreen={fullScreen}>
            <Container
              fade={fade}
              centered={centered}
              maxWidth={maxWidth}
              maxHeight={maxHeight}
              className={cn(ClassName.MODAL, className, `${ClassName.MODAL}--${id ?? 'unknown'}`)}
              fullScreen={fullScreen}
            >
              {leftSidebar?.()}
              <Box flex={10} maxWidth="100%">
                {withHeader && (
                  <Header headerBorder={headerBorder}>
                    <BoxFlex height="100%">
                      <BoxFlex height="100%" id={Identifier.MODAL_TITLE_CONTAINER}>
                        {title}
                      </BoxFlex>

                      {intoTooltip && (
                        <Box ml={8}>
                          <TutorialInfoIcon>{intoTooltip}</TutorialInfoIcon>
                        </Box>
                      )}
                    </BoxFlex>
                    <BoxFlex height="100%">
                      {headerActions && <BoxFlex mr={16}>{headerActions}</BoxFlex>}
                      {closable && (
                        <IconButton
                          size={16}
                          id={Identifier.MODAL_CLOSE_BUTTON_REGULAR}
                          icon="close"
                          variant={IconButtonVariant.BASIC}
                          onClick={onClose}
                        />
                      )}
                    </BoxFlex>
                  </Header>
                )}

                <BoxFlex column fullHeight={fullScreen}>
                  {children}
                </BoxFlex>
              </Box>
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

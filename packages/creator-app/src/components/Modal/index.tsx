import { Box, IconButton, IconButtonVariant, Portal, TutorialInfoIcon } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { ModalType } from '@/constants';
import { useModals, useTheme } from '@/hooks';
import { ClassName, Identifier } from '@/styles/constants';

import { Body, Container, Footer, Header, Root } from './components';

/**
 * @deprecated
 */
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
  verticalMargin?: number;
  className?: string;
  withHeader?: boolean;
  intoTooltip?: React.ReactNode;
  headerActions?: React.ReactNode;
  headerBorder?: boolean;
  fullScreen?: boolean;
  leftSidebar?: () => React.ReactElement;
  capitalizeText?: boolean;
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
      verticalMargin,
      children,
      className,
      withHeader = true,
      intoTooltip,
      headerActions,
      leftSidebar,
      fullScreen = false,
      capitalizeText = true,
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
              verticalMargin={verticalMargin}
              className={cn(ClassName.MODAL, className, `${ClassName.MODAL}--${id ?? 'unknown'}`)}
              fullScreen={fullScreen}
            >
              {leftSidebar?.()}
              <Box flex={10} maxWidth="100%">
                {withHeader && (
                  <Header headerBorder={headerBorder} capitalizeText={capitalizeText}>
                    <Box.Flex height="100%">
                      <Box.Flex height="100%" id={Identifier.MODAL_TITLE_CONTAINER}>
                        {title}
                      </Box.Flex>

                      {intoTooltip && (
                        <Box ml={8}>
                          <TutorialInfoIcon>{intoTooltip}</TutorialInfoIcon>
                        </Box>
                      )}
                    </Box.Flex>
                    <Box.Flex height="100%">
                      {headerActions && <Box.Flex mr={16}>{headerActions}</Box.Flex>}
                      {closable && (
                        <IconButton
                          size={16}
                          id={Identifier.MODAL_CLOSE_BUTTON_REGULAR}
                          icon="close"
                          variant={IconButtonVariant.BASIC}
                          onClick={onClose}
                        />
                      )}
                    </Box.Flex>
                  </Header>
                )}

                <Box.Flex column fullHeight={fullScreen}>
                  {children}
                </Box.Flex>
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

export default Object.assign(React.forwardRef<HTMLDivElement, React.PropsWithChildren<ModalProps>>(Modal), {
  Root,
  Body,
  Footer,
  Header,
  Container,
});

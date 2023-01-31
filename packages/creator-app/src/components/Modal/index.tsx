import { Box, Modal as UIModal, Portal } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { ModalType } from '@/constants';
import { useModals } from '@/hooks/modals';
import { useTheme } from '@/hooks/theme';
import { ClassName } from '@/styles/constants';

import { Container } from './components';

/**
 * @deprecated
 */
export const { Body: ModalBody, Footer: ModalFooter } = UIModal;

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
  contentStyle?: React.CSSProperties;
  className?: string;
  withHeader?: boolean;
  infoTooltip?: React.ReactNode;
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
      infoTooltip,
      headerActions,
      leftSidebar,
      fullScreen = false,
      capitalizeText = true,
      contentStyle,
    },
    ref
  ) => {
    const theme = useTheme();

    const nestedTheme = React.useMemo(() => ({ ...theme, zIndex: { ...theme.zIndex, popper: theme.zIndex.modal + 1 } }), [theme]);

    return (
      <ThemeProvider theme={nestedTheme}>
        <Portal portalNode={document.body}>
          <UIModal.S.Root ref={ref} hidden={!isOpened} centered={centered} fullScreen={fullScreen}>
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

              <Box flex={10} maxWidth="100%" style={contentStyle}>
                {withHeader && (
                  <UIModal.Header
                    border={headerBorder}
                    actions={
                      headerActions || closable ? (
                        <>
                          {headerActions}

                          {closable && <UIModal.Header.CloseButtonAction onClick={onClose} />}
                        </>
                      ) : null
                    }
                    infoTooltip={infoTooltip}
                    capitalizeText={capitalizeText}
                  >
                    {title}
                  </UIModal.Header>
                )}

                <Box.Flex column fullHeight={fullScreen}>
                  {children}
                </Box.Flex>
              </Box>
            </Container>
          </UIModal.S.Root>
        </Portal>
      </ThemeProvider>
    );
  }
);

const Modal: React.ForwardRefRenderFunction<HTMLDivElement, ModalProps> = ({ id, ...props }, ref) => {
  const { fade, isOpened, close, isInStack } = useModals(id);

  return !isInStack ? null : <UncontrolledModal {...props} id={id} ref={ref} fade={fade} onClose={close} isOpened={isOpened} />;
};

/**
 * @deprecated use ModalsV2 instead
 */
export default Object.assign(React.forwardRef<HTMLDivElement, React.PropsWithChildren<ModalProps>>(Modal), {
  Body: UIModal.Body,
  Footer: UIModal.Footer,
  Header: UIModal.Header,
});

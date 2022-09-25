import Portal from '@ui/components/Portal';
import { useConst, useTheme } from '@ui/hooks';
import { ANIMATION_SPEED, ClassName } from '@ui/styles/constants';
import cn from 'classnames';
import React from 'react';
import { Transition } from 'react-transition-group';
import type { ExitHandler } from 'react-transition-group/Transition';
import { ThemeProvider } from 'styled-components';

import { Header } from './components';
import * as S from './styles';

export interface ModalProps {
  type?: string;
  hidden: boolean;
  opened: boolean;
  animated?: boolean;
  centered?: boolean;
  onExited?: ExitHandler<HTMLDivElement>;
  maxWidth?: number;
  className?: string;
  maxHeight?: number;
  minHeight?: number;
  fullScreen?: boolean;
  verticalMargin?: number;
  hideScrollbar?: boolean;
}

const EXTRA_ANIMATION_TIME = 0.02;

const Modal = React.forwardRef<HTMLDivElement, React.PropsWithChildren<ModalProps>>(
  (
    {
      type,
      hidden,
      opened,
      animated = true,
      children,
      centered,
      maxWidth,
      onExited,
      maxHeight,
      minHeight,
      className,
      fullScreen = false,
      verticalMargin,
      hideScrollbar = false,
    },
    ref
  ) => {
    const theme = useTheme();
    const enterAnimation = useConst(animated);

    const nestedTheme = React.useMemo(() => ({ ...theme, zIndex: { ...theme.zIndex, popper: theme.zIndex.modal + 1 } }), [theme]);

    return (
      <ThemeProvider theme={nestedTheme}>
        <Portal portalNode={document.body}>
          <S.Root ref={ref} hidden={hidden} centered={centered} fullScreen={fullScreen}>
            <Transition
              in={opened}
              timeout={animated ? (ANIMATION_SPEED + EXTRA_ANIMATION_TIME) * 1000 : 1}
              onExited={onExited}
              mountOnEnter
              unmountOnExit
            >
              {(status) => (
                <S.Container
                  status={status}
                  animated={animated}
                  centered={centered}
                  maxWidth={maxWidth}
                  maxHeight={maxHeight}
                  minHeight={minHeight}
                  className={cn(ClassName.MODAL, className, `${ClassName.MODAL}--${type ?? 'unknown'}`)}
                  fullScreen={fullScreen}
                  verticalMargin={verticalMargin}
                  enterAnimation={enterAnimation}
                  hideScrollbar={hideScrollbar}
                >
                  {children}
                </S.Container>
              )}
            </Transition>
          </S.Root>
        </Portal>
      </ThemeProvider>
    );
  }
);

export default Object.assign(Modal, {
  S,

  Body: S.Body,
  Header,
  Footer: S.Footer,
  Backdrop: S.Backdrop,
});

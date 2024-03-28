import { clsx } from '@voiceflow/style';
import { Modal as UIModal, PopperProvider, Portal, RefUtil, Tokens, usePersistFunction } from '@voiceflow/ui-next';
import React from 'react';
import type { TransitionStatus } from 'react-transition-group';
import { Transition } from 'react-transition-group';

import { useHotkeyList } from '@/hooks/hotkeys';
import { Hotkey } from '@/keymap';

import { Z_INDEX } from './ModalContainer.constant';
import { containerStyles, rootRecipe } from './ModalContainer.css';
import type { IModalContainer } from './ModalContainer.interface';

export const ModalContainer = React.forwardRef<HTMLDivElement, IModalContainer>(
  (
    {
      type,
      width,
      hidden,
      opened,
      testID,
      stacked = false,
      animated = true,
      children,
      onExited,
      onExiting,
      className,
      onEscClose,
      onEnterSubmit,
      containerClassName,
    },
    ref
  ) => {
    const [popperContainer, setPopperContainer] = React.useState<HTMLDivElement | null>(null);

    const renderContainer = ({ index, status, children }: { index: number; status: TransitionStatus; children: React.ReactNode; stacked: boolean }) =>
      !!children && (
        <UIModal.Container
          width={width}
          testID={testID}
          className={clsx(
            containerStyles({ status: animated ? status : undefined, notVisible: !children }),
            `modal--${type ?? 'unknown'}`,
            typeof className === 'string' ? className : className?.[index]
          )}
        >
          {children}
        </UIModal.Container>
      );

    const onRef = usePersistFunction((node: HTMLDivElement | null) => {
      setPopperContainer(node);
      RefUtil.setRef(ref, node);
    });

    useHotkeyList([
      { hotkey: Hotkey.MODAL_CLOSE, callback: usePersistFunction(onEscClose), disable: !onEscClose, preventDefault: true },
      { hotkey: Hotkey.MODAL_SUBMIT, callback: usePersistFunction(onEnterSubmit), disable: !onEnterSubmit, allowInputs: true, preventDefault: true },
    ]);

    return (
      <PopperProvider portalNode={popperContainer ?? undefined} zIndex={Z_INDEX}>
        <Portal portalNode={document.body}>
          <div ref={onRef} hidden={hidden} className={clsx(rootRecipe({ hidden }), containerClassName)}>
            <Transition
              in={opened}
              timeout={animated ? parseFloat(Tokens.animation.duration.default) * 2 * 1000 : 1}
              onExited={onExited}
              onExiting={onExiting}
              mountOnEnter
              unmountOnExit
            >
              {(status) =>
                stacked
                  ? React.Children.map(children, (child, index) => renderContainer({ status, children: child, stacked, index }))
                  : renderContainer({ status, children, stacked, index: 0 })
              }
            </Transition>
          </div>
        </Portal>
      </PopperProvider>
    );
  }
);

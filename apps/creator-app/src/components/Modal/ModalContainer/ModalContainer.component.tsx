import { clsx } from '@voiceflow/style';
import { Modal as UIModal, PopperProvider, Portal, Tokens } from '@voiceflow/ui-next';
import React from 'react';
import type { TransitionStatus } from 'react-transition-group';
import { Transition } from 'react-transition-group';

import { useHotkey } from '@/hooks/hotkeys';
import { Hotkey } from '@/keymap';

import { Z_INDEX } from './ModalContainer.constant';
import { containerStyles, popperContainerStyles, rootRecipe } from './ModalContainer.css';
import type { IModalContainer } from './ModalContainer.interface';

export const ModalContainer = React.forwardRef<HTMLDivElement, IModalContainer>(
  ({ type, hidden, opened, stacked = false, animated = true, children, onExited, onEscClose, className }, ref) => {
    const [popperContainer, setPopperContainer] = React.useState<HTMLDivElement | null>(null);

    const renderContainer = ({ status, children }: { status: TransitionStatus; children: React.ReactNode }) => (
      <UIModal.Container className={clsx(containerStyles({ status: animated ? status : undefined }), `modal--${type ?? 'unknown'}`, className)}>
        {children}
      </UIModal.Container>
    );

    useHotkey(Hotkey.MODAL_CLOSE, () => onEscClose?.());

    return (
      <PopperProvider portalNode={popperContainer ?? undefined} zIndex={Z_INDEX}>
        <Portal portalNode={document.body}>
          <div ref={ref} hidden={hidden} className={rootRecipe({ hidden })}>
            <Transition
              in={opened}
              timeout={animated ? parseFloat(Tokens.animation.duration.default) * 2 * 1000 : 1}
              onExited={onExited}
              mountOnEnter
              unmountOnExit
            >
              {(status) =>
                stacked
                  ? React.Children.map(children, (child) => renderContainer({ status, children: child }))
                  : renderContainer({ status, children })
              }
            </Transition>

            <div ref={setPopperContainer} className={popperContainerStyles} />
          </div>
        </Portal>
      </PopperProvider>
    );
  }
);

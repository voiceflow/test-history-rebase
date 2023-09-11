import { clsx } from '@voiceflow/style';
import { Modal as UIModal, PopperProvider, Portal, Tokens } from '@voiceflow/ui-next';
import React from 'react';
import type { TransitionStatus } from 'react-transition-group';
import { Transition } from 'react-transition-group';

import { useHotkey } from '@/hooks/hotkeys';
import { Hotkey } from '@/keymap';

import { Z_INDEX } from './Modal.constant';
import { containerStyles, rootRecipe } from './Modal.css';
import type { IModal } from './Modal.interface';

export const Modal = React.forwardRef<HTMLDivElement, IModal>(
  ({ type, hidden, opened, stacked = false, animated = true, children, onExited, onEscClose, className }, ref) => {
    const renderContainer = ({ status, children }: { status: TransitionStatus; children: React.ReactNode }) => (
      <UIModal.Container className={clsx(containerStyles({ status }), `modal--${type ?? 'unknown'}`, className)}>{children}</UIModal.Container>
    );

    useHotkey(Hotkey.MODAL_CLOSE, () => onEscClose?.());

    return (
      <PopperProvider zIndex={Z_INDEX}>
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
          </div>
        </Portal>
      </PopperProvider>
    );
  }
);

import { clsx } from '@voiceflow/style';
import { Portal, Tokens } from '@voiceflow/ui-next';
import React from 'react';
import { Transition } from 'react-transition-group';

import { useLocalStorageState } from '@/hooks/storage.hook';

import { containerStyle } from './TipPortal.css';
import { ITipPortal } from './TipPortal.interface';

export const TipPortal: React.FC<ITipPortal> = ({ scope, closing, children }) => {
  const [visible, setVisible] = useLocalStorageState(`vf_tip:${scope}`, true);

  return (
    <Transition in={visible} timeout={parseFloat(Tokens.animation.duration.default) * 1000} unmountOnExit>
      {(status) => (
        <Portal>
          <div className={clsx('vfui', containerStyle({ closing: status === 'exiting' || closing }))}>
            {children({ onClose: () => setVisible(false) })}
          </div>
        </Portal>
      )}
    </Transition>
  );
};

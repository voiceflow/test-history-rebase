import { Portal } from '@voiceflow/ui-next';
import React from 'react';

import { stopImmediatePropagation } from '@/utils/handler.util';

import { backdrop } from './ModalBackdrop.css';
import type { IModalBackdrop } from './ModalBackdrop.interface';

export const ModalBackdrop: React.FC<IModalBackdrop> = ({ closing, onClose, closePrevented }) => (
  <Portal portalNode={document.body}>
    <div
      onClick={closePrevented ? undefined : onClose}
      onPaste={stopImmediatePropagation()}
      className={backdrop({ closing, closePrevented })}
    />
  </Portal>
);

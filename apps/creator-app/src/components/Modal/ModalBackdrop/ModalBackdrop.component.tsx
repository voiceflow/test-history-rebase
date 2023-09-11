import { Portal } from '@voiceflow/ui-next';
import React from 'react';

import { stopImmediatePropagation } from '@/utils/handler.util';

import { backdrop } from './ModalBackdrop.css';
import type { IModalBackdrop } from './ModalBackdrop.interface';

export const ModalBackdrop: React.FC<IModalBackdrop> = ({ closing, onClick, closePrevented }) => (
  <Portal portalNode={document.body}>
    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
    <div onClick={closePrevented ? undefined : onClick} onPaste={stopImmediatePropagation()} className={backdrop({ closing, closePrevented })} />
  </Portal>
);

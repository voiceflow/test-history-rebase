import React from 'react';

import { AlexaStageType, DialogflowStageType, GoogleStageType } from '@/constants/platforms';
import { useHotKeys, useOnClickOutside } from '@/hooks';
import { Hotkey } from '@/keymap';

import PopupCloseIcon from './PopupCloseIcon';
import PopupContainer from './PopupContainer';
import PopupTransition from './PopupTransition';

export interface UploadPopupProps {
  open: boolean;
  onClose: () => void;
  jobStage?: AlexaStageType | GoogleStageType | DialogflowStageType | null;
  className?: string;
  multiSelect?: boolean;
}

const UploadPopup: React.FC<UploadPopupProps> = ({ open, onClose, children, jobStage, multiSelect, className }) => {
  const ref = React.useRef(null);
  useOnClickOutside(ref, onClose);

  useHotKeys(Hotkey.CLOSE_UPLOAD_MODAL, onClose, { preventDefault: true }, [onClose]);

  return !children ? null : (
    <PopupContainer open={open} jobStage={jobStage} multiSelect={multiSelect} className={className} ref={ref}>
      <PopupCloseIcon onClick={onClose} />
      <PopupTransition>{children}</PopupTransition>
    </PopupContainer>
  );
};

export default UploadPopup;

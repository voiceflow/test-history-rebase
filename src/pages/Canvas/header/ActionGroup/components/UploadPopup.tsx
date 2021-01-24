import React from 'react';

import { AlexaStageType, GoogleStageType } from '@/constants/platforms';

import PopupCloseIcon from './PopupCloseIcon';
import PopupContainer from './PopupContainer';
import PopupTransition from './PopupTransition';

export type UploadPopupProps = {
  open: boolean;
  onClose: () => void;
  jobStage?: AlexaStageType | GoogleStageType | null;
  multiSelect?: boolean;
};

const UploadPopup: React.FC<UploadPopupProps> = ({ open, onClose, children, jobStage, multiSelect }) => {
  return (
    <PopupContainer open={open} jobStage={jobStage} multiSelect={multiSelect}>
      <PopupCloseIcon onClick={onClose} />
      <PopupTransition>{children}</PopupTransition>
    </PopupContainer>
  );
};

export default UploadPopup;

import React from 'react';

import { AlexaStageType, DialogflowStageType, GoogleStageType } from '@/constants/platforms';

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

const UploadPopup: React.FC<UploadPopupProps> = ({ open, onClose, children, jobStage, multiSelect, className }) =>
  !children ? null : (
    <PopupContainer open={open} jobStage={jobStage} multiSelect={multiSelect} className={className}>
      <PopupCloseIcon onClick={onClose} />
      <PopupTransition>{children}</PopupTransition>
    </PopupContainer>
  );

export default UploadPopup;

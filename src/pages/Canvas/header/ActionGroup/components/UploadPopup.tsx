import React from 'react';

import { AlexaStageType, GoogleStageType } from '@/constants/platforms';

import PopupCloseIcon from './PopupCloseIcon';
import PopupContainer from './PopupContainer';
import PopupTransition from './PopupTransition';

export type UploadPopupProps = {
  open: boolean;
  onClose: () => void;
  noCloseIcon?: boolean;
  jobStage?: AlexaStageType | GoogleStageType | null;
  projectExists?: boolean;
};

const UploadPopup: React.FC<UploadPopupProps> = ({ open, onClose, children, noCloseIcon, jobStage, projectExists }) => {
  return (
    <PopupContainer open={open} jobStage={jobStage} projectExists={projectExists}>
      {!noCloseIcon && <PopupCloseIcon onClick={onClose} />}
      <PopupTransition>{children}</PopupTransition>
    </PopupContainer>
  );
};

export default UploadPopup;

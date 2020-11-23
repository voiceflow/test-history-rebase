import React from 'react';

import PopupCloseIcon from './PopupCloseIcon';
import PopupContainer from './PopupContainer';
import PopupTransition from './PopupTransition';

export type UploadPopupProps = {
  open: boolean;
  onClose: () => void;
};

const UploadPopup: React.FC<UploadPopupProps> = ({ open, onClose, children }) => (
  <PopupContainer open={open}>
    <PopupCloseIcon onClick={onClose} />
    <PopupTransition>{children}</PopupTransition>
  </PopupContainer>
);

export default UploadPopup;

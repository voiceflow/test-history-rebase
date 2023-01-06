import { useOnClickOutside } from '@voiceflow/ui';
import React from 'react';

import { AnyStageType } from '@/constants/platforms';
import * as ProjectV2 from '@/ducks/projectV2';
import { useHotKeys, useSelector } from '@/hooks';
import { Hotkey } from '@/keymap';

import PopupContainer from './components/PopupContainer';
import PopupTransition from './components/PopupTransition';

export interface PlatformUploadPopupProps {
  open: boolean;
  onClose: () => void;
  jobStage?: AnyStageType | null;
  className?: string;
}

const PlatformUploadPopup: React.OldFC<PlatformUploadPopupProps> = ({ open, onClose, children, jobStage, className }) => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const ref = React.useRef(null);

  useOnClickOutside(ref, () => open && onClose(), [open, onClose]);

  useHotKeys(Hotkey.CLOSE_UPLOAD_MODAL, () => open && onClose(), { preventDefault: true }, [open, onClose]);

  return !children ? null : (
    <PopupContainer open={open} jobStage={jobStage} className={className} platform={platform} ref={ref}>
      <PopupTransition>{children}</PopupTransition>
    </PopupContainer>
  );
};

export default PlatformUploadPopup;

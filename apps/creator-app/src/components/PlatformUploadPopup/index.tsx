import { useOnClickOutside } from '@voiceflow/ui';
import React from 'react';

import type { AnyStageType } from '@/constants/platforms';
import * as ProjectV2 from '@/ducks/projectV2';
import { useHotkey, useSelector } from '@/hooks';
import { Hotkey } from '@/keymap';

import PopupContainer from './components/PopupContainer';
import PopupTransition from './components/PopupTransition';

export interface PlatformUploadPopupProps extends React.PropsWithChildren {
  open: boolean;
  onClose: VoidFunction;
  jobStage?: AnyStageType | null;
  className?: string;
}

const PlatformUploadPopup: React.FC<PlatformUploadPopupProps> = ({ open, onClose, children, jobStage, className }) => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const ref = React.useRef(null);

  useOnClickOutside(ref, () => open && onClose(), [open, onClose]);

  useHotkey(Hotkey.CLOSE_UPLOAD_MODAL, () => open && onClose(), { preventDefault: true });

  return !children ? null : (
    <PopupContainer open={open} jobStage={jobStage} className={className} platform={platform} ref={ref}>
      <PopupTransition>{children}</PopupTransition>
    </PopupContainer>
  );
};

export default PlatformUploadPopup;

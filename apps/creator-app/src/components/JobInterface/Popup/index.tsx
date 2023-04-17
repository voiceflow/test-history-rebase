import { SvgIcon, useOnClickOutside } from '@voiceflow/ui';
import React from 'react';

import PopupTransition from '@/components/PlatformUploadPopup/components/PopupTransition';

import { CloseContainer, PopupContainer } from './styles';

export interface JobInterfacePopupProps extends React.PropsWithChildren {
  dismissable?: boolean;
  closeable?: boolean;
  cancel: VoidFunction;
}

const JobInterfacePopup: React.FC<JobInterfacePopupProps> = ({ children, dismissable, closeable, cancel }) => {
  const containerRef = React.useRef(null);

  useOnClickOutside(containerRef, () => dismissable && cancel(), []);

  return (
    <PopupContainer ref={containerRef}>
      <PopupTransition>
        {closeable && (
          <CloseContainer>
            <SvgIcon icon="close" clickable onClick={() => cancel()} />
          </CloseContainer>
        )}
        {children}
      </PopupTransition>
    </PopupContainer>
  );
};

export default JobInterfacePopup;

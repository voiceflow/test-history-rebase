import { IS_MOBILE } from '@voiceflow/ui';
import React from 'react';

import MobileWarning from './components/MobileWarning';
import ScreenSizeWarning from './components/ScreenSizeWarning';

interface Props extends React.PropsWithChildren {
  screenSizeWarning?: boolean;
}

/**
 * check that the device meets certain capabilities after login
 */
const PrivateCapabilitiesGate: React.FC<Props> = ({ children, screenSizeWarning = true }) => {
  if (IS_MOBILE) {
    return <MobileWarning />;
  }

  return (
    <>
      {children}
      {screenSizeWarning && <ScreenSizeWarning />}
    </>
  );
};

export default PrivateCapabilitiesGate;

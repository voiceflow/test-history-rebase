import { IS_MOBILE } from '@voiceflow/ui';
import React from 'react';

import MobileWarning from './components/MobileWarning';
import ScreenSizeWarning from './components/ScreenSizeWarning';

/**
 * check that the device meets certain capabilities after login
 */
const PrivateCapabilitiesGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  if (IS_MOBILE) {
    return <MobileWarning />;
  }

  return (
    <>
      {children}
      <ScreenSizeWarning />
    </>
  );
};

export default PrivateCapabilitiesGate;

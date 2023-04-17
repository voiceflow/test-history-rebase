import React from 'react';

import { AlexaProvider } from './Alexa';
import { GoogleProvider } from './Google';

export const PlatformProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
  <AlexaProvider>
    <GoogleProvider>{children}</GoogleProvider>
  </AlexaProvider>
);

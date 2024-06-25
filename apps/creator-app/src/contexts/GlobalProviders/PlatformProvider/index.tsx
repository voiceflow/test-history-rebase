import React from 'react';

import { AlexaProvider } from './Alexa';

export const PlatformProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
  <AlexaProvider>{children}</AlexaProvider>
);

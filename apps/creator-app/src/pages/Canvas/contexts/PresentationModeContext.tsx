import React from 'react';

export const PresentationModeContext = React.createContext(false);
export const { Consumer: PresentationModeConsumer } = PresentationModeContext;

export const PresentationModeProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
  <PresentationModeContext.Provider value>{children}</PresentationModeContext.Provider>
);

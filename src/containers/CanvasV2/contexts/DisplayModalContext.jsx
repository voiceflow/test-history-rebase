import React from 'react';

import { withContext } from '@/hocs';
import { useToggle } from '@/hooks';

export const DisplayModalContext = React.createContext(null);
export const { Consumer: DisplayModalConsumer } = DisplayModalContext;

export const DisplayModalProvider = ({ children }) => {
  const [isEnabled, toggle] = useToggle();
  const [displayID, setDisplayID] = React.useState();
  const [datasource, setDataSource] = React.useState();
  const [aplCommands, setAPLCommands] = React.useState();

  return (
    <DisplayModalContext.Provider value={{ isEnabled, toggle, displayID, setDisplayID, datasource, setDataSource, aplCommands, setAPLCommands }}>
      {children}
    </DisplayModalContext.Provider>
  );
};

export const withDisplayModalContext = withContext(DisplayModalContext, 'displayModal');

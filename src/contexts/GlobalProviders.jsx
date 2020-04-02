import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { ThemeProvider } from 'styled-components';

import { IS_PRODUCTION } from '@/config';
import { MaintenanceGate } from '@/gates';
import theme from '@/styles/theme';

import { DragProvider } from './DragContext';
import { EventualEngineProvider } from './EventualEngineContext';
import LifecycleProvider from './LifecycleProvider';
import { ModalsContextProvider } from './ModalsContext';
import { MousePositionProvider } from './MousePositionContext';
import { OverlayProvider } from './OverlayContext';
import { RolePermissionsProvider } from './RolePermissionsContext';
import StoreProvider from './StoreProvider';
import { TextEditorVariablesPopoverProvider } from './TextEditorVariablesPopoverContext';

const GlobalProviders = ({ history, store, persistor, children }) => {
  const renderApp = () => (
    <ConnectedRouter history={history}>
      <LifecycleProvider history={history}>{children}</LifecycleProvider>
    </ConnectedRouter>
  );

  // eslint-disable-next-line xss/no-mixed-html
  return (
    <StoreProvider store={store} persistor={persistor}>
      <DndProvider backend={HTML5Backend}>
        <ThemeProvider theme={theme}>
          <TextEditorVariablesPopoverProvider value={document.body}>
            <MousePositionProvider>
              <DragProvider>
                <OverlayProvider>
                  <EventualEngineProvider>
                    <RolePermissionsProvider>
                      <ModalsContextProvider>{IS_PRODUCTION ? <MaintenanceGate>{renderApp}</MaintenanceGate> : renderApp()}</ModalsContextProvider>
                    </RolePermissionsProvider>
                  </EventualEngineProvider>
                </OverlayProvider>
              </DragProvider>
            </MousePositionProvider>
          </TextEditorVariablesPopoverProvider>
        </ThemeProvider>
      </DndProvider>
    </StoreProvider>
  );
};

export default GlobalProviders;

// eslint-disable-next-line react/display-name
export const withGlobalProviders = (Component) => ({ history, store, persistor, ...props }) => (
  <GlobalProviders history={history} store={store} persistor={persistor}>
    <Component {...props} />
  </GlobalProviders>
);

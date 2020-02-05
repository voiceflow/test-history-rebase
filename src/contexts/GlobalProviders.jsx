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
import { ModalLayerProvider } from './ModalLayerContext';
import { ModalsContextProvider } from './ModalsContext';
import { MousePositionProvider } from './MousePositionContext';
import { OverlayProvider } from './OverlayContext';
import { RolePermissionsProvider } from './RolePermissionsContext';
import StoreProvider from './StoreProvider';

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
          <MousePositionProvider>
            <DragProvider>
              <ModalLayerProvider>
                <OverlayProvider>
                  <EventualEngineProvider>
                    <RolePermissionsProvider>
                      <ModalsContextProvider>{IS_PRODUCTION ? <MaintenanceGate>{renderApp}</MaintenanceGate> : renderApp()}</ModalsContextProvider>
                    </RolePermissionsProvider>
                  </EventualEngineProvider>
                </OverlayProvider>
              </ModalLayerProvider>
            </DragProvider>
          </MousePositionProvider>
        </ThemeProvider>
      </DndProvider>
    </StoreProvider>
  );
};

export default GlobalProviders;

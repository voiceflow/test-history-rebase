import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { ThemeProvider } from 'styled-components';

import { MaintenanceGate } from '@/gates';
import theme from '@/styles/theme';

import { DragProvider } from './DragContext';
import { EventualEngineProvider } from './EventualEngineContext';
import LifecycleProvider from './LifecycleProvider';
import { MousePositionProvider } from './MousePositionContext';
import { OverlayProvider } from './OverlayContext';
import StoreProvider from './StoreProvider';

// eslint-disable-next-line xss/no-mixed-html
const GlobalProviders = ({ history, store, persistor, children }) => (
  <StoreProvider store={store} persistor={persistor}>
    <DndProvider backend={HTML5Backend}>
      <ThemeProvider theme={theme}>
        <MousePositionProvider>
          <DragProvider>
            <OverlayProvider>
              <EventualEngineProvider>
                <MaintenanceGate>
                  {() => (
                    <ConnectedRouter history={history}>
                      <LifecycleProvider history={history}>{children}</LifecycleProvider>
                    </ConnectedRouter>
                  )}
                </MaintenanceGate>
              </EventualEngineProvider>
            </OverlayProvider>
          </DragProvider>
        </MousePositionProvider>
      </ThemeProvider>
    </DndProvider>
  </StoreProvider>
);

export default GlobalProviders;

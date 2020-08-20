import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';
import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Persistor } from 'redux-persist';
import { ThemeProvider } from 'styled-components';

import { IS_PRODUCTION_ENV } from '@/config';
import { MaintenanceGate } from '@/gates';
import { Store } from '@/store/types';
import theme from '@/styles/theme';

import { DragProvider } from './DragContext';
import { EventualEngineProvider } from './EventualEngineContext';
import { IdentityProvider } from './IdentityContext';
import LifecycleProvider from './LifecycleProvider';
import { ModalsContextProvider } from './ModalsContext';
import { MousePositionProvider } from './MousePositionContext';
import { OverlayProvider } from './OverlayContext';
import StoreProvider from './StoreProvider';
import { TextEditorVariablesPopoverProvider } from './TextEditorVariablesPopoverContext';

export type GlobalProvidersProps = {
  history: History;
  store: Store;
  persistor: Persistor;
};

const GlobalProviders: React.FC<GlobalProvidersProps> = ({ history, store, persistor, children }) => {
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
                    <IdentityProvider>
                      <ModalsContextProvider>
                        {IS_PRODUCTION_ENV ? <MaintenanceGate>{renderApp}</MaintenanceGate> : renderApp()}
                      </ModalsContextProvider>
                    </IdentityProvider>
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
export const withGlobalProviders = <T extends object>(Component: React.FC<T>) => ({
  history,
  store,
  persistor,
  ...props
}: T & GlobalProvidersProps) => (
  <GlobalProviders history={history} store={store} persistor={persistor}>
    <Component {...(props as T)} />
  </GlobalProviders>
);

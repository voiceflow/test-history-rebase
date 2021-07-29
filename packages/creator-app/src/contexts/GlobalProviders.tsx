import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';
import React from 'react';
import { DismissableLayersGlobalProvider } from 'react-dismissable-layers';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { IntercomProvider } from 'react-use-intercom';
import { Persistor } from 'redux-persist';
import { ThemeProvider } from 'styled-components';

import { INTERCOM_APP_ID, IS_PRODUCTION_ENV } from '@/config';
import { FeatureLoadingGate, MaintenanceGate, RealtimeConnectionGate } from '@/gates';
import { Store } from '@/store/types';
import THEME from '@/styles/theme';

import { DragProvider } from './DragContext';
import { EventualEngineProvider } from './EventualEngineContext';
import { FeatureFlagsProvider } from './FeatureFlagsContext';
import { IdentityProvider } from './IdentityContext';
import LifecycleProvider from './LifecycleProvider';
import { ModalsContextProvider } from './ModalsContext';
import { MousePositionProvider } from './MousePositionContext';
import StoreProvider from './StoreProvider';
import { TextEditorVariablesPopoverProvider } from './TextEditorVariablesPopoverContext';

export interface GlobalProvidersProps {
  history: History;
  store: Store;
  persistor: Persistor;
}

const GlobalProviders: React.FC<GlobalProvidersProps> = ({ history, store, persistor, children }) => {
  const renderApp = () => (
    <LifecycleProvider history={history}>
      <FeatureFlagsProvider>
        <FeatureLoadingGate>
          <IntercomProvider appId={INTERCOM_APP_ID}>
            <RealtimeConnectionGate>
              <IdentityProvider>
                <EventualEngineProvider>
                  <TextEditorVariablesPopoverProvider value={document.body}>
                    <MousePositionProvider>
                      <DismissableLayersGlobalProvider>
                        <DragProvider>
                          <ModalsContextProvider>{children}</ModalsContextProvider>
                        </DragProvider>
                      </DismissableLayersGlobalProvider>
                    </MousePositionProvider>
                  </TextEditorVariablesPopoverProvider>
                </EventualEngineProvider>
              </IdentityProvider>
            </RealtimeConnectionGate>
          </IntercomProvider>
        </FeatureLoadingGate>
      </FeatureFlagsProvider>
    </LifecycleProvider>
  );

  // eslint-disable-next-line xss/no-mixed-html
  return (
    <StoreProvider store={store} persistor={persistor}>
      <ConnectedRouter history={history}>
        <DndProvider backend={HTML5Backend}>
          <ThemeProvider theme={THEME}>{IS_PRODUCTION_ENV ? <MaintenanceGate>{renderApp}</MaintenanceGate> : renderApp()}</ThemeProvider>
        </DndProvider>
      </ConnectedRouter>
    </StoreProvider>
  );
};

export default GlobalProviders;

// eslint-disable-next-line react/display-name
export const withGlobalProviders =
  <T extends object>(Component: React.FC<T>) =>
  ({ history, store, persistor, ...props }: T & GlobalProvidersProps) =>
    (
      <GlobalProviders history={history} store={store} persistor={persistor}>
        <Component {...(props as T)} />
      </GlobalProviders>
    );

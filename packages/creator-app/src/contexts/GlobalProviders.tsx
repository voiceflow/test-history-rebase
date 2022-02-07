import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';
import React from 'react';
import { DismissableLayersGlobalProvider } from 'react-dismissable-layers';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { IntercomProvider } from 'react-use-intercom';
import { ThemeProvider } from 'styled-components';

import { INTERCOM_APP_ID, IS_PRODUCTION_ENV } from '@/config';
import {
  AccountLoadingGate,
  AccountSubscriptionGate,
  CapabilitiesGate,
  FeatureLoadingGate,
  MaintenanceGate,
  RealtimeConnectionGate,
  SocketLoadingGate,
} from '@/gates';
import THEME from '@/styles/theme';

import { AutoPanningProvider } from './AutoPanningContext';
import { DragProvider } from './DragContext';
import { EventualEngineProvider } from './EventualEngineContext';
import { FeatureFlagsProvider } from './FeatureFlagsContext';
import { IdentityProvider } from './IdentityContext';
import LifecycleProvider from './LifecycleProvider';
import { ModalsContextProvider } from './ModalsContext';
import { MousePositionProvider } from './MousePositionContext';
import StoreProvider, { StoreProviderProps } from './StoreProvider';
import { TextEditorVariablesPopoverProvider } from './TextEditorVariablesPopoverContext';

export interface GlobalProvidersProps extends StoreProviderProps {
  history: History;
}

const GlobalProviders: React.FC<GlobalProvidersProps> = ({ history, store, persistor, logux, children }) => {
  const app = (
    <LifecycleProvider history={history}>
      <FeatureFlagsProvider>
        <FeatureLoadingGate>
          <IntercomProvider appId={INTERCOM_APP_ID}>
            <IdentityProvider>
              <EventualEngineProvider>
                <TextEditorVariablesPopoverProvider value={document.body}>
                  <MousePositionProvider>
                    <DismissableLayersGlobalProvider>
                      <DragProvider>
                        <AutoPanningProvider>
                          <ModalsContextProvider>
                            <SocketLoadingGate>
                              <AccountLoadingGate>
                                <RealtimeConnectionGate>
                                  <AccountSubscriptionGate>{children}</AccountSubscriptionGate>
                                </RealtimeConnectionGate>
                              </AccountLoadingGate>
                            </SocketLoadingGate>
                          </ModalsContextProvider>
                        </AutoPanningProvider>
                      </DragProvider>
                    </DismissableLayersGlobalProvider>
                  </MousePositionProvider>
                </TextEditorVariablesPopoverProvider>
              </EventualEngineProvider>
            </IdentityProvider>
          </IntercomProvider>
        </FeatureLoadingGate>
      </FeatureFlagsProvider>
    </LifecycleProvider>
  );

  // eslint-disable-next-line xss/no-mixed-html
  return (
    <StoreProvider store={store} persistor={persistor} logux={logux}>
      <ConnectedRouter history={history}>
        <DndProvider backend={HTML5Backend}>
          <ThemeProvider theme={THEME}>
            <CapabilitiesGate>{IS_PRODUCTION_ENV ? <MaintenanceGate>{app}</MaintenanceGate> : app}</CapabilitiesGate>
          </ThemeProvider>
        </DndProvider>
      </ConnectedRouter>
    </StoreProvider>
  );
};

export default GlobalProviders;

export const withGlobalProviders =
  <T extends object>(Component: React.FC<T>) =>
  ({ history, store, persistor, logux, ...props }: T & GlobalProvidersProps) =>
    (
      <GlobalProviders history={history} store={store} persistor={persistor} logux={logux}>
        <Component {...(props as T)} />
      </GlobalProviders>
    );

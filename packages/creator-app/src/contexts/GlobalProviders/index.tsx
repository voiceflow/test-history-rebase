import { Upload } from '@voiceflow/ui';
import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';
import React from 'react';
import { DismissableLayersGlobalProvider } from 'react-dismissable-layers';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ThemeProvider } from 'styled-components';

import client from '@/client';
import { AccountLoadingGate, AccountSubscriptionGate, CapabilitiesGate, FeatureLoadingGate, MaintenanceGate, RealtimeConnectionGate } from '@/gates';
import * as ModalsV2 from '@/ModalsV2';
import THEME from '@/styles/theme';
import * as Sentry from '@/vendors/sentry';

import { AutoPanningProvider } from '../AutoPanningContext';
import { DragProvider } from '../DragContext';
import { EventualEngineProvider } from '../EventualEngineContext';
import { FeatureFlagsProvider } from '../FeatureFlagsContext';
import { IdentityProvider } from '../IdentityContext';
import LifecycleProvider from '../LifecycleProvider';
import { MLProvider } from '../MLContext';
import { ModalsContextProvider } from '../ModalsContext';
import { MousePositionProvider } from '../MousePositionContext';
import { ProjectConfigProvider } from '../ProjectConfigProvider';
import StoreProvider, { StoreProviderProps } from '../StoreProvider';
import { TextEditorVariablesPopoverProvider } from '../TextEditorVariablesPopoverContext';
import { VoiceflowAssistantVisibilityProvider } from '../VoiceflowAssistantVisibility';
import SessionTracker from './components/SessionTracker';

export interface GlobalProvidersProps extends StoreProviderProps {
  history: History;
}
/* eslint-disable-next-line xss/no-mixed-html */
const GlobalProviders: React.FC<GlobalProvidersProps> = ({ history, store, persistor, logux, children }) => (
  <StoreProvider store={store} persistor={persistor} logux={logux}>
    <ConnectedRouter history={history}>
      <DndProvider backend={HTML5Backend}>
        <ThemeProvider theme={THEME}>
          <CapabilitiesGate>
            <MaintenanceGate>
              <LifecycleProvider history={history}>
                <SessionTracker />
                <FeatureFlagsProvider>
                  <FeatureLoadingGate>
                    <IdentityProvider>
                      <EventualEngineProvider>
                        <TextEditorVariablesPopoverProvider value={document.body}>
                          <MousePositionProvider>
                            <DismissableLayersGlobalProvider>
                              <DragProvider>
                                <AutoPanningProvider>
                                  <ProjectConfigProvider>
                                    <ModalsContextProvider>
                                      <ModalsV2.Provider>
                                        <Upload.Provider client={client.upload} onError={Sentry.error}>
                                          <AccountLoadingGate>
                                            <RealtimeConnectionGate>
                                              <MLProvider>
                                                <AccountSubscriptionGate>
                                                  <VoiceflowAssistantVisibilityProvider>
                                                    {/* to keep on a new line */}
                                                    {children}
                                                  </VoiceflowAssistantVisibilityProvider>
                                                </AccountSubscriptionGate>
                                              </MLProvider>
                                            </RealtimeConnectionGate>
                                          </AccountLoadingGate>
                                        </Upload.Provider>
                                      </ModalsV2.Provider>
                                    </ModalsContextProvider>
                                  </ProjectConfigProvider>
                                </AutoPanningProvider>
                              </DragProvider>
                            </DismissableLayersGlobalProvider>
                          </MousePositionProvider>
                        </TextEditorVariablesPopoverProvider>
                      </EventualEngineProvider>
                    </IdentityProvider>
                  </FeatureLoadingGate>
                </FeatureFlagsProvider>
              </LifecycleProvider>
            </MaintenanceGate>
          </CapabilitiesGate>
        </ThemeProvider>
      </DndProvider>
    </ConnectedRouter>
  </StoreProvider>
);

export default GlobalProviders;

export const withGlobalProviders =
  <T extends object>(Component: React.FC<T>) =>
  ({ history, store, persistor, logux, ...props }: T & GlobalProvidersProps) =>
    (
      <GlobalProviders history={history} store={store} persistor={persistor} logux={logux}>
        <Component {...(props as T)} />
      </GlobalProviders>
    );

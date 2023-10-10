import { datadogRum } from '@datadog/browser-rum';
import { Upload } from '@voiceflow/ui';
import { ToastContainer } from '@voiceflow/ui-next';
import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';
import React from 'react';
import { DismissableLayersGlobalProvider } from 'react-dismissable-layers';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ThemeProvider } from 'styled-components';

import client from '@/client';
import RealtimeStatus from '@/components/RealtimeStatus';
import { AccountLoadingGate, AccountSubscriptionGate, CapabilitiesGate, FeatureLoadingGate, MaintenanceGate, RealtimeConnectionGate } from '@/gates';
import * as ModalsV2 from '@/ModalsV2';
import THEME from '@/styles/theme';

import { AutoPanningProvider } from '../AutoPanningContext';
import { DragProvider } from '../DragContext';
import { EventualEngineProvider } from '../EventualEngineContext';
import { FeatureFlagsProvider } from '../FeatureFlagsContext';
import { HotkeysContextProvider } from '../HotkeysContext';
import { IdentityProvider } from '../IdentityContext';
import LifecycleProvider from '../LifecycleProvider';
import { MLProvider } from '../MLContext';
import { MousePositionProvider } from '../MousePositionContext';
import { PlanPricesProvider } from '../PlanPricesContext';
import { ProjectConfigProvider } from '../ProjectConfigProvider';
import StoreProvider, { StoreProviderProps } from '../StoreProvider';
import { TextEditorVariablesPopoverProvider } from '../TextEditorVariablesPopoverContext';
import { VoiceflowAssistantVisibilityProvider } from '../VoiceflowAssistantVisibility';
import SessionTracker from './components/SessionTracker';
import { PlatformProvider } from './PlatformProvider';

export interface GlobalProvidersProps extends StoreProviderProps {
  history: History;
}
/* eslint-disable-next-line xss/no-mixed-html */
const GlobalProviders: React.FC<GlobalProvidersProps> = ({ history, store, persistor, realtime, children }) => (
  <StoreProvider store={store} persistor={persistor} realtime={realtime}>
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
                      <PlanPricesProvider>
                        <EventualEngineProvider>
                          <TextEditorVariablesPopoverProvider value={document.body}>
                            <MousePositionProvider>
                              <DismissableLayersGlobalProvider>
                                <DragProvider>
                                  <AutoPanningProvider>
                                    <HotkeysContextProvider>
                                      <ProjectConfigProvider>
                                        <PlatformProvider>
                                          <ModalsV2.Provider>
                                            <Upload.Provider client={client.upload} onError={datadogRum.addError}>
                                              <ToastContainer />
                                              <RealtimeStatus />
                                              <ModalsV2.Placeholder />

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
                                        </PlatformProvider>
                                      </ProjectConfigProvider>
                                    </HotkeysContextProvider>
                                  </AutoPanningProvider>
                                </DragProvider>
                              </DismissableLayersGlobalProvider>
                            </MousePositionProvider>
                          </TextEditorVariablesPopoverProvider>
                        </EventualEngineProvider>
                      </PlanPricesProvider>
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
  <T extends object>(Component: React.FC<T>): React.FC<T & GlobalProvidersProps> =>
  ({ history, store, persistor, realtime, ...props }) =>
    (
      <GlobalProviders history={history} store={store} persistor={persistor} realtime={realtime}>
        <Component {...(props as T)} />
      </GlobalProviders>
    );

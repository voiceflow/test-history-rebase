import { datadogRum } from '@datadog/browser-rum';
import { NotifyContainer } from '@voiceflow/ui-next';
import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';
import React from 'react';
import { DismissableLayersGlobalProvider } from 'react-dismissable-layers';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ThemeProvider } from 'styled-components';

import client from '@/client';
import { ComponentTupple, Compose } from '@/components/Compose/Compose.component';
import Upload from '@/components/legacy/Upload';
import { PageLoaderProvider } from '@/components/Loader/PageLoader/PageLoader.provider';
import { Modal } from '@/components/Modal';
import RealtimeStatus from '@/components/RealtimeStatus';
import {
  AccountLoadingGate,
  AccountSubscriptionGate,
  CapabilitiesGate,
  FeatureLoadingGate,
  MaintenanceGate,
  RealtimeConnectionGate,
} from '@/gates';
import * as ModalsV2 from '@/ModalsV2';
import THEME from '@/styles/theme';

import { AutoPanningProvider } from '../AutoPanningContext';
import { DragProvider } from '../DragContext';
import { EventualEngineProvider } from '../EventualEngineContext';
import { FeatureFlagsProvider } from '../FeatureFlagsContext';
import { HotkeysContextProvider } from '../HotkeysContext';
import { IdentityProvider } from '../IdentityContext';
import LifecycleProvider from '../LifecycleProvider';
import { MousePositionProvider } from '../MousePositionContext';
import { PlanPricesProvider } from '../PlanPricesContext';
import { ProjectConfigProvider } from '../ProjectConfigProvider';
import StoreProvider, { StoreProviderProps } from '../StoreProvider';
import { VoiceflowAssistantVisibilityProvider } from '../VoiceflowAssistantVisibility';
import { PlatformProvider } from './PlatformProvider';

export interface GlobalProvidersProps extends StoreProviderProps {
  history: History;
}

const GlobalProviders: React.FC<GlobalProvidersProps> = ({ history, store, persistor, realtime, children }) => (
  <Compose
    components={[
      PageLoaderProvider,
      [StoreProvider, { store, persistor, realtime }] satisfies ComponentTupple<typeof StoreProvider>,
      [ConnectedRouter, { history }] satisfies ComponentTupple<typeof ConnectedRouter>,
      [DndProvider, { backend: HTML5Backend }] satisfies ComponentTupple<typeof DndProvider>,
      [ThemeProvider, { theme: THEME }] satisfies ComponentTupple<typeof ThemeProvider>,
      CapabilitiesGate,
      MaintenanceGate,
      [LifecycleProvider, { history }] satisfies ComponentTupple<typeof LifecycleProvider>,
      FeatureFlagsProvider,
      FeatureLoadingGate,
      IdentityProvider,
      PlanPricesProvider,
      EventualEngineProvider,
      MousePositionProvider,
      DismissableLayersGlobalProvider,
      DragProvider,
      AutoPanningProvider,
      HotkeysContextProvider,
      ProjectConfigProvider,
      PlatformProvider,
      ModalsV2.Provider,
      [Upload.Provider, { client: client.upload, onError: datadogRum.addError }] satisfies ComponentTupple<
        typeof Upload.Provider
      >,
      ({ children }) => (
        <>
          <NotifyContainer />
          <RealtimeStatus />
          <Modal.Placeholder />
          {children}
        </>
      ),
      AccountLoadingGate,
      RealtimeConnectionGate,
      AccountSubscriptionGate,
      VoiceflowAssistantVisibilityProvider,
    ]}
  >
    {children}
  </Compose>
);

export default GlobalProviders;

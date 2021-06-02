import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';
import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { IntercomProvider } from 'react-use-intercom';
import { Persistor } from 'redux-persist';
import { ThemeProvider } from 'styled-components';

import { APLRendererProvider } from '@/components/APLRenderer';
import { INTERCOM_APP_ID, IS_PRODUCTION_ENV } from '@/config';
import { MaintenanceGate } from '@/gates';
import { Store } from '@/store/types';
import THEME from '@/styles/theme';

import { DragProvider } from './DragContext';
import { EventualEngineProvider } from './EventualEngineContext';
import { FeatureFlagsProvider } from './FeatureFlagsContext';
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
      <FeatureFlagsProvider>
        <DndProvider backend={HTML5Backend}>
          <ThemeProvider theme={THEME}>
            <IntercomProvider appId={INTERCOM_APP_ID}>
              <TextEditorVariablesPopoverProvider value={document.body}>
                <MousePositionProvider>
                  <DragProvider>
                    <OverlayProvider>
                      <EventualEngineProvider>
                        <IdentityProvider>
                          <ModalsContextProvider>
                            <APLRendererProvider>
                              {IS_PRODUCTION_ENV ? <MaintenanceGate>{renderApp}</MaintenanceGate> : renderApp()}
                            </APLRendererProvider>
                          </ModalsContextProvider>
                        </IdentityProvider>
                      </EventualEngineProvider>
                    </OverlayProvider>
                  </DragProvider>
                </MousePositionProvider>
              </TextEditorVariablesPopoverProvider>
            </IntercomProvider>
          </ThemeProvider>
        </DndProvider>
      </FeatureFlagsProvider>
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

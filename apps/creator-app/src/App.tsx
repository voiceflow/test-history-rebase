import { TippyTooltip, ToastContainer } from '@voiceflow/ui';
import React from 'react';

import { RootPageProgressBar } from '@/components/PageProgressBar';
import SeoHelmet from '@/components/SeoHelmet';
import SupportChat from '@/components/SupportChat';
import WorkspaceTracker from '@/components/WorkspaceTracker';
import { SeoPage } from '@/constants/seo';
import ChatAssistant from '@/services/ChatAssistant';
import DatadogRum from '@/services/DatadogRum';

import { ChargebeeScript } from './components/ChargebeeScript.component';
import type { GlobalProvidersProps } from './contexts/GlobalProviders';
import GlobalProviders from './contexts/GlobalProviders';
import Routes from './Routes';

const App: React.FC<GlobalProvidersProps> = (props) => (
  <GlobalProviders {...props}>
    <SeoHelmet page={SeoPage.ROOT} />
    <TippyTooltip.GlobalStyles />
    <ToastContainer />
    <Routes />
    <RootPageProgressBar />
    <SupportChat />
    <DatadogRum />
    <WorkspaceTracker />
    <ChatAssistant />
    <ChargebeeScript />
  </GlobalProviders>
);

export default App;

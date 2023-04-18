// Import Dependent CSS, attempt to deprecate

import 'bootstrap/dist/css/bootstrap.min.css';
import 'simplebar/dist/simplebar.min.css';
import './App.css';

import { TippyTooltip, ToastContainer } from '@voiceflow/ui';
import React from 'react';

import { RootPageProgressBar } from '@/components/PageProgressBar';
import SeoHelmet from '@/components/SeoHelmet';
import SupportChat from '@/components/SupportChat';
import WorkspaceTracker from '@/components/WorkspaceTracker';
import { SeoPage } from '@/constants/seo';
import Beamer from '@/services/Beamer';
import ChatAssistant from '@/services/ChatAssistant';
import DatadogRum from '@/services/DatadogRum';

import { withGlobalProviders } from './contexts/GlobalProviders';
import Routes from './Routes';

const App: React.FC = () => (
  <>
    <SeoHelmet page={SeoPage.ROOT} />
    <TippyTooltip.GlobalStyles />
    <ToastContainer />
    <Routes />
    <RootPageProgressBar />
    <SupportChat />
    <DatadogRum />
    <Beamer />
    <WorkspaceTracker />
    <ChatAssistant />
  </>
);

export default withGlobalProviders(App);

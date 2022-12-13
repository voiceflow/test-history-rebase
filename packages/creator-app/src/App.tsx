// Import Dependent CSS, attempt to deprecate

import 'react-tippy/dist/tippy.css';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'simplebar/dist/simplebar.min.css';
import './App.css';
import 'react-day-picker/lib/style.css';

import { ToastContainer } from '@voiceflow/ui';
import React from 'react';

import { RootPageProgressBar } from '@/components/PageProgressBar';
import SeoHelmet from '@/components/SeoHelmet';
import SupportChat from '@/components/SupportChat';
import TrackNewCodeVersion from '@/components/TrackNewCodeVersion';
import { SeoPage } from '@/constants/seo';
import { compose } from '@/hocs';
import AppModals from '@/modals/AppModals';
import * as ModalsV2 from '@/ModalsV2';
import Beamer from '@/services/Beamer';
import ChatAssistant from '@/services/ChatAssistant';
import DatadogRum from '@/services/DatadogRum';

import { GlobalProvidersProps, withGlobalProviders } from './contexts/GlobalProviders';
import Routes from './Routes';

const App: React.FC = () => (
  <>
    <SeoHelmet page={SeoPage.ROOT} />
    <ToastContainer />
    <Routes />
    <AppModals />
    <ModalsV2.Placeholder />
    <RootPageProgressBar />
    <SupportChat />
    <TrackNewCodeVersion />
    <DatadogRum />
    <Beamer />
    <ChatAssistant />
  </>
);

export default compose(withGlobalProviders)(App) as React.FC<GlobalProvidersProps>;

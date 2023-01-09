// we should import this files otherwise components in showcase and app packages can look different due to some global styles
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'simplebar/dist/simplebar.min.css';
// eslint-disable-next-line import/no-relative-packages
import '../../creator-app/src/App.css';

import { TippyTooltip } from '@voiceflow/ui';
import React from 'react';
import { DismissableLayersGlobalProvider } from 'react-dismissable-layers';
import { BrowserRouter } from 'react-router-dom';

import Page from '@/components/Page';
import Routes from '@/Routes';

const App: React.FC = () => (
  <DismissableLayersGlobalProvider>
    <BrowserRouter>
      <Page>
        <TippyTooltip.GlobalStyles />

        <Routes />
      </Page>
    </BrowserRouter>
  </DismissableLayersGlobalProvider>
);

export default App;

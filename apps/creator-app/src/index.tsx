import './index.css';
import './polyfills';
import '@voiceflow/ui-next/theme.css';

import React from 'react';
import { createRoot } from 'react-dom/client';

import client from '@/client';
import { realtimeClient } from '@/client/realtime';

import App from './App';
import { history, persistor, store } from './setupStore';

const root = createRoot(document.getElementById('root')!);

root.render(<App history={history} store={store} persistor={persistor} realtime={realtimeClient} />);

window.addEventListener('beforeunload', () => {
  client.analytics.setBatching(false);
  client.analytics.flush();
});

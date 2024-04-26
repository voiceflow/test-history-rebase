import { importScript } from '@voiceflow/ui';

import { CHARGEBEE_PUBLISHABLE_KEY, CHARGEBEE_SITE } from '@/config';

export const initialize = async () => {
  await importScript({
    id: 'chargebee-js',
    uri: 'https://js.chargebee.com/v2/chargebee.js',
    callbackName: 'onChargebeeReady',
  });

  window.Chargebee.init({
    site: CHARGEBEE_SITE,
    publishableKey: CHARGEBEE_PUBLISHABLE_KEY,
  });

  return window.Chargebee.getInstance();
};

export const getClient = () => {
  const instance = window.Chargebee.getInstance();

  if (!instance) throw new Error('chargebee client not initialized');

  return instance;
};

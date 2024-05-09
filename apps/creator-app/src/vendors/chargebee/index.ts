import { importScript } from '@voiceflow/ui';

import { CHARGEBEE_PUBLISHABLE_KEY, CHARGEBEE_SITE } from '@/config';

export const initialize = async () => {
  if (window.Chargebee?.getInstance()) return;

  await importScript({ id: 'chargebee-js', uri: 'https://js.chargebee.com/v2/chargebee.js' });

  window.Chargebee.init({
    site: CHARGEBEE_SITE,
    publishableKey: CHARGEBEE_PUBLISHABLE_KEY,
  });

  if (!window.Chargebee.getInstance()) {
    throw new Error('chargebee client could not be initialized');
  }
};

export const getClient = () => {
  return window.Chargebee.getInstance();
};

import { importScript } from '@voiceflow/ui';

import { AMAZON_APP_ID } from '@/config';

export const initialize = async () => {
  await importScript({ id: 'amazon-sdk', uri: '//api-cdn.amazon.com/sdk/login1.js', callbackName: 'onAmazonLoginReady' });

  window.amazon.Login.setClientId(AMAZON_APP_ID);
};

export const authorize = (options: CodeAuthorizeOptions) =>
  new Promise<CodeRequest>((resolve, reject) => {
    window.amazon.Login.authorize(options, async (response) => {
      if (!response || response.error) {
        reject(new Error(response?.error_description ?? response?.error ?? 'Something went wrong'));
        return;
      }

      resolve(response);
    });
  });

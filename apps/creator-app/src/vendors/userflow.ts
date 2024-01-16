import userflow from 'userflow.js';

import { USERFLOW_TOKEN } from '@/config';

export const initialize = () => {
  if (!USERFLOW_TOKEN) return;

  userflow.init(USERFLOW_TOKEN);
};

export const identify = async (externalID: string, user: { name: string; email: string; createdAt: string }) => {
  if (!USERFLOW_TOKEN) return;

  await userflow.identify(externalID, {
    name: user.name,
    email: user.email,
    created: user.createdAt,
  });
};

export const endAll = () => userflow.endAll();

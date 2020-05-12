import userflow from 'userflow.js';

import { USERFLOW_ENABLED, USERFLOW_TOKEN } from '@/config';
import { Account } from '@/models';

export const initialize = () => {
  if (USERFLOW_ENABLED) {
    userflow.init(USERFLOW_TOKEN);
  }
};

export const identify = async (user: Account) => {
  if (USERFLOW_ENABLED) {
    await userflow.identify(String(user.creator_id), {
      name: user.name,
      email: user.email,
      signed_up_at: user.created,
    });
  }
};

export const startFlow = async (flowID: string) => {
  if (USERFLOW_ENABLED) {
    await (userflow.start || userflow.startFlow)(flowID);
  }
};

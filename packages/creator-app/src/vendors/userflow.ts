import userflow from 'userflow.js';

import { USERFLOW_ENABLED, USERFLOW_TOKEN } from '@/config';
import { Account } from '@/models';

export enum Event {
  DASHBOARD_VISITED = 'dashboard_visited',
}

export const initialize = () => {
  if (!USERFLOW_ENABLED) return;

  userflow.init(USERFLOW_TOKEN);
};

export const identify = async (externalID: string, user: Omit<Account, 'creator_id'>) => {
  if (!USERFLOW_ENABLED) return;

  await userflow.identify(externalID, {
    name: user.name,
    email: user.email,
    signed_up_at: user.created,
  });
};

export const startFlow = async (flowID: string) => {
  if (USERFLOW_ENABLED) {
    await userflow.start(flowID);
  }
};

export const track = async (event: string) => {
  if (!USERFLOW_ENABLED) return;

  await userflow.track(event);
};

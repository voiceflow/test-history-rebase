import userflow from 'userflow.js';

import { USERFLOW_TOKEN } from '@/config';
import { Account } from '@/models';

export enum Event {
  DASHBOARD_VISITED = 'dashboard_visited',
}

export const initialize = () => {
  if (!USERFLOW_TOKEN) return;

  userflow.init(USERFLOW_TOKEN);
};

export const identify = async (externalID: string, user: Omit<Account, 'creator_id'>) => {
  if (!USERFLOW_TOKEN) return;

  await userflow.identify(externalID, {
    name: user.name,
    email: user.email,
    created: user.created,
  });
};

const USERFLOW_ALL_CHANNELS_ONBOARDING_FLOW_ID = 'c53799c6-8dca-4695-9d24-7ca4bfd74867';

// start flows when a project is created from a template
export const startOnboardingFlow = async () => {
  if (!USERFLOW_TOKEN) return;

  await userflow.start(USERFLOW_ALL_CHANNELS_ONBOARDING_FLOW_ID);
};

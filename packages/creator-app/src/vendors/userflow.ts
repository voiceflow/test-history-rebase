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

const USERFLOW_CHAT_ONBOARDING_FLOW_ID = '3cf4fbe4-3d7d-41c7-8889-36d6b9467bfc';

// start flows when a project is created from a template
export const startOnboardingFlow = async (templateTag: string) => {
  if (!USERFLOW_TOKEN) return;

  if (templateTag === 'onboarding:chat') {
    await userflow.start(USERFLOW_CHAT_ONBOARDING_FLOW_ID);
  }
};

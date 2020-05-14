import { IntercomAPI, UpdateOptions } from 'react-intercom';

import { LOGROCKET_PROJECT } from '@/config';
import { Account, Workspace } from '@/models';
import { NullableRecord } from '@/types';

export function createUser(user: NullableRecord<Account>, workspace: Workspace = {} as Workspace) {
  return user.creator_id
    ? {
        // user info
        user_id: user.creator_id,
        name: user.name,
        email: user.email,
        // active workspace info
        workspace: workspace.name,
        workspace_id: workspace.id,
        plan: workspace.plan || 'basic',
        seats: workspace.seats,
        custom_launcher_selector: '.custom_intercom_launcher',
        logrocketURL: `https://app.logrocket.com/${LOGROCKET_PROJECT}/sessions?u=${user.creator_id}`,
      }
    : {
        custom_launcher_selector: '.custom_intercom_launcher',
      };
}

export const updateSettings = (data: UpdateOptions) => {
  try {
    IntercomAPI('update', data);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('failed to update settings', e);
  }
};

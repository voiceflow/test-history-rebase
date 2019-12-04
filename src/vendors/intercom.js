import { IntercomAPI } from 'react-intercom';

import { INTERCOM_ENABLED, LOGROCKET_PROJECT } from '@/config';
import { getUserPlanName } from '@/utils/admin';

// eslint-disable-next-line import/prefer-default-export
export function createIntercomUser(user) {
  return user.creator_id
    ? {
        user_id: user.creator_id,
        name: user.name,
        email: user.email,
        plan: getUserPlanName(user.admin),
        custom_launcher_selector: '.custom_intercom_launcher',
        logrocketURL: `https://app.logrocket.com/${LOGROCKET_PROJECT}/sessions?u=${user.creator_id}`,
      }
    : {
        custom_launcher_selector: '.custom_intercom_launcher',
      };
}

export const updateSettings = (data) => INTERCOM_ENABLED && IntercomAPI('update', data);

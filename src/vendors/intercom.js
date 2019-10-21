import { LOGROCKET_PROJECT } from '@/config';
import { getUserPlanName } from '@/utils/admin';

// eslint-disable-next-line import/prefer-default-export
export function createIntercomUser(user) {
  return user.creator_id
    ? {
        user_id: user.creator_id,
        name: user.name,
        email: user.email,
        plan: getUserPlanName(user.admin),
        logrocketURL: `https://app.logrocket.com/${LOGROCKET_PROJECT}/sessions?u=${user.creator_id}`,
      }
    : {};
}

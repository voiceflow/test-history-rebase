import type { Enum } from '@/utils/type/enum.util';

export const StripePlanType = {
  OLD_STARTER: 'old_starter',
  OLD_PRO: 'old_pro',
  OLD_TEAM: 'old_team',
  STARTER: 'starter',
  STUDENT: 'student',
  PRO: 'pro',
  TEAM: 'team',
  ENTERPRISE: 'enterprise',
  CREATOR: 'creator',
};

export type StripePlanType = Enum<typeof StripePlanType>;

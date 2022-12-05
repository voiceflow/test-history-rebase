import { PlanType } from '@voiceflow/internal';

import { LimitDetails, upgradeToEnterpriseAction } from '@/config/planLimits';
import { ENTERPRISE_PLANS } from '@/constants/plans';

export const STARTER_PRO_EDITOR_LIMIT = 5;

export const EditorLimitDetails: LimitDetails = {
  modalTitle: 'New Editor',
  title: 'Need more editors?',
  description: 'Upgrade to enterprise to unlock unlimited editors for your organization.',
  submitText: 'Contact Sales',
  onSubmit: upgradeToEnterpriseAction,
};

export const canAddEditor = (plan: PlanType | null | undefined, numEditors: number) =>
  (plan && ENTERPRISE_PLANS.includes(plan as any)) || numEditors < STARTER_PRO_EDITOR_LIMIT;

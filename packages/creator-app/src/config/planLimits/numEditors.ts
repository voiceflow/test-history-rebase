import { PlanType } from '@voiceflow/internal';

import { ENTERPRISE_LIMIT_PLANS, LimitDetails, upgradeToEnterpriseAction } from '@/config/planLimits/index';

export const STARTER_PRO_EDITOR_LIMIT = 5;

export const EditorLimitDetails: LimitDetails = {
  modalTitle: 'New Editor',
  title: 'Need more editors?',
  description: 'Upgrade to enterprise to unlock unlimited editors for your organization.',
  submitText: 'Contact Sales',
  onSubmit: upgradeToEnterpriseAction,
};

export const canAddEditor = (plan: PlanType | null | undefined, numEditors: number) =>
  (plan && ENTERPRISE_LIMIT_PLANS.includes(plan)) || numEditors < STARTER_PRO_EDITOR_LIMIT;

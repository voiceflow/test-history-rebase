import { PlanType } from '@voiceflow/internal';

import { ENTERPRISE_LABEL, ENTERPRISE_LIMIT_PLANS, LimitDetails } from '@/config/planLimits/index';
import { BOOK_DEMO_LINK } from '@/constants/links';

export const WorkspacesLimitDetails: LimitDetails = {
  modalTitle: 'New Workspace',
  title: 'Need more workspaces?',
  description: `Multiple workspaces is an ${ENTERPRISE_LABEL} feature. Please contact sales to unlock.`,
  submitText: 'Contact Sales',
  onSubmit: () => window.open(BOOK_DEMO_LINK, '_blank'),
};

export const canAddWorkspace = (plan: PlanType | null | undefined) => {
  return plan && ENTERPRISE_LIMIT_PLANS.includes(plan);
};

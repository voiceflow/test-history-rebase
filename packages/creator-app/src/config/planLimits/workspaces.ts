import { PlanType } from '@voiceflow/internal';

import { ENTERPRISE_LABEL, ENTERPRISE_LIMIT_PLANS, LimitDetails, upgradeToEnterpriseAction } from '@/config/planLimits/index';

export const WorkspacesLimitDetails: LimitDetails = {
  modalTitle: 'New Workspace',
  title: 'Need more workspaces?',
  description: `Multiple workspaces is an ${ENTERPRISE_LABEL} feature. Please contact sales to unlock.`,
  submitText: 'Contact Sales',
  onSubmit: upgradeToEnterpriseAction,
};

export const canAddWorkspace = (plan: PlanType | null | undefined) => plan && ENTERPRISE_LIMIT_PLANS.includes(plan);

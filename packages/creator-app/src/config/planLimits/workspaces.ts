import { PlanType } from '@voiceflow/internal';

import { ENTERPRISE_LABEL, LimitDetails, upgradeToEnterpriseAction } from '@/config/planLimits';
import { ENTERPRISE_PLANS } from '@/constants/plans';

export const WorkspacesLimitDetails: LimitDetails = {
  modalTitle: 'New Workspace',
  title: 'Need more workspaces?',
  description: `Multiple workspaces is an ${ENTERPRISE_LABEL} feature. Please contact sales to unlock.`,
  submitText: 'Contact Sales',
  onSubmit: upgradeToEnterpriseAction,
};

export const canAddWorkspace = (plan: PlanType | null | undefined) => plan && ENTERPRISE_PLANS.includes(plan as any);

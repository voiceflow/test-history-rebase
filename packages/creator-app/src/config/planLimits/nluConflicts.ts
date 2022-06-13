import { ENTERPRISE_LABEL, UPGRADE_TO_ENTERPRISE_ACTION_LABEL, upgradeToEnterpriseAction } from '@/config/planLimits';

export const NluViewConflictsLimitDetails = {
  modalTitle: 'Intent Conflicts',
  title: 'Need to view intent conflicts?',
  description: `Viewing intent conflicts is an ${ENTERPRISE_LABEL} feature. Please contact sales to unlock.`,
  submitText: UPGRADE_TO_ENTERPRISE_ACTION_LABEL,
  onSubmit: upgradeToEnterpriseAction,
};

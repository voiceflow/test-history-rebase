import { TEAM_LABEL, UPGRADE_TO_TEAM_ACTION_LABEL, upgradeToTeamAction } from '@/config/planLimits';

export const BulkImportLimitDetails = {
  modalTitle: 'Bulk Import',
  title: '',
  description: `This is a ${TEAM_LABEL} feature. Please upgrade to bulk import content.`,
  submitText: UPGRADE_TO_TEAM_ACTION_LABEL,
  onSubmit: upgradeToTeamAction,
};

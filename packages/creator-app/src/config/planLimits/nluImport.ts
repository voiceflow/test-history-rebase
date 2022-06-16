import { TEAM_LABEL, UPGRADE_TO_TEAM_ACTION_LABEL, upgradeToTeamAction } from '@/config/planLimits';

export const NLUImportLimitDetails = {
  modalTitle: 'NLU Import',
  title: 'Need to import NLU data?',
  description: `NLU import is a ${TEAM_LABEL} feature. Please upgrade to ${TEAM_LABEL} to continue. `,
  submitText: UPGRADE_TO_TEAM_ACTION_LABEL,
  onSubmit: upgradeToTeamAction,
};

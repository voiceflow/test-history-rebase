import { UPGRADE_TO_TEAM_ACTION_LABEL, upgradeToTeamAction } from '@/config/planLimits';

export const TranscriptsLimitDetails = {
  modalTitle: 'Transcripts',
  title: 'Need conversation transcripts?',
  description: 'Review and improve your assistant with transcript data from tests and prototype sessions. ',
  submitText: UPGRADE_TO_TEAM_ACTION_LABEL,
  onSubmit: upgradeToTeamAction,
};

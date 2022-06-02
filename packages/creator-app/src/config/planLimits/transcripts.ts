import { upgradeToTeamAction, UPRADE_TO_TEAM_ACTION_LABEL } from '@/config/planLimits';

export const TranscriptsLimitDetails = {
  modalTitle: 'Transcripts',
  title: 'Need conversation transcripts?',
  description: 'Review and improve your assistant with transcript data from tests and prototype sessions. ',
  submitText: UPRADE_TO_TEAM_ACTION_LABEL,
  onSubmit: upgradeToTeamAction,
};

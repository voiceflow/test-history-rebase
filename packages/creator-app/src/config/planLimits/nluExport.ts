import * as NLP from '@/config/nlp';
import {
  ENTERPRISE_LABEL,
  LimitDetails,
  TEAM_LABEL,
  UPGRADE_TO_ENTERPRISE_ACTION_LABEL,
  UPGRADE_TO_TEAM_ACTION_LABEL,
  upgradeToEnterpriseAction,
  upgradeToTeamAction,
} from '@/config/planLimits';

const nluEnterpriseExportDetails = (nlpConfig: NLP.Base.Config) => ({
  title: `Need to export data for ${nlpConfig.name}?`,
  onSubmit: upgradeToEnterpriseAction,
  submitText: UPGRADE_TO_ENTERPRISE_ACTION_LABEL,
  modalTitle: 'NLU Export',
  description: `This NLU export is an ${ENTERPRISE_LABEL} feature. Please contact sales to unlock this feature.`,
  tooltipText: `${nlpConfig.name} is a enterprise feature.`,
  tooltipButtonText: UPGRADE_TO_ENTERPRISE_ACTION_LABEL,
  tooltipOnClick: upgradeToEnterpriseAction,
});

export const NLUExportLimitDetails: Record<NLP.Constants.NLPType, LimitDetails> = {
  [NLP.Constants.NLPType.LUIS]: nluEnterpriseExportDetails(NLP.Luis.CONFIG),
  [NLP.Constants.NLPType.RASA2]: nluEnterpriseExportDetails(NLP.Rasa2.CONFIG),
  [NLP.Constants.NLPType.RASA3]: nluEnterpriseExportDetails(NLP.Rasa3.CONFIG),
  [NLP.Constants.NLPType.ALEXA]: nluEnterpriseExportDetails(NLP.Alexa.CONFIG),
  [NLP.Constants.NLPType.LEX_V1]: nluEnterpriseExportDetails(NLP.LexV1.CONFIG),
  [NLP.Constants.NLPType.WATSON]: nluEnterpriseExportDetails(NLP.Watson.CONFIG),
  [NLP.Constants.NLPType.EINSTEIN]: nluEnterpriseExportDetails(NLP.Einstein.CONFIG),
  [NLP.Constants.NLPType.NUANCE_MIX]: nluEnterpriseExportDetails(NLP.NuanceMix.CONFIG),
  [NLP.Constants.NLPType.DIALOGFLOW_ES]: nluEnterpriseExportDetails(NLP.DialogflowES.CONFIG),
  [NLP.Constants.NLPType.DIALOGFLOW_CX]: nluEnterpriseExportDetails(NLP.DialogflowCX.CONFIG),

  [NLP.Constants.NLPType.VOICEFLOW]: {
    modalTitle: 'CSV Export',
    title: 'Need to export data as CSV?',
    description: `CSV export is a ${TEAM_LABEL} feature. Please upgrade to ${TEAM_LABEL} to continue. `,
    submitText: UPGRADE_TO_TEAM_ACTION_LABEL,
    onSubmit: upgradeToTeamAction,
    tooltipText: `${NLP.Voiceflow.CONFIG.name} is a team feature.`,
    tooltipButtonText: UPGRADE_TO_TEAM_ACTION_LABEL,
    tooltipOnClick: upgradeToTeamAction,
  },
};

export const getNLUExportLimitDetails = (exportType: NLP.Constants.NLPType): LimitDetails => NLUExportLimitDetails[exportType];

export const isGatedNLUExportType = (exportType: NLP.Constants.NLPType, canExport: boolean, canExportCSV: boolean) => {
  return !((canExportCSV && exportType === NLP.Constants.NLPType.VOICEFLOW) || (canExport && exportType !== NLP.Constants.NLPType.VOICEFLOW));
};

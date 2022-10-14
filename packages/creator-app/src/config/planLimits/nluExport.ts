import {
  ENTERPRISE_LABEL,
  LimitDetails,
  TEAM_LABEL,
  UPGRADE_TO_ENTERPRISE_ACTION_LABEL,
  UPGRADE_TO_TEAM_ACTION_LABEL,
  upgradeToEnterpriseAction,
  upgradeToTeamAction,
} from '@/config/planLimits';
import { NLPProvider, NLPProviderLabels } from '@/constants';

const NLU_MODAL_TITLE = 'NLU Export';
const NLU_ENTERPRISE_DESCRIPTION = `This NLU export is an ${ENTERPRISE_LABEL} feature. Please contact sales to unlock this feature.`;

const nluEnterpriseExportDetails = (exportFormat: NLPProvider) => {
  return {
    modalTitle: NLU_MODAL_TITLE,
    title: `Need to export data for ${NLPProviderLabels[exportFormat]}?`,
    description: NLU_ENTERPRISE_DESCRIPTION,
    submitText: UPGRADE_TO_ENTERPRISE_ACTION_LABEL,
    onSubmit: upgradeToEnterpriseAction,
    tooltipText: `${NLPProviderLabels[exportFormat]} is a enterprise feature.`,
    tooltipButtonText: UPGRADE_TO_ENTERPRISE_ACTION_LABEL,
    tooltipOnClick: upgradeToEnterpriseAction,
  };
};

export const NLUExportLimitDetails: Record<NLPProvider, LimitDetails> = {
  [NLPProvider.ALEXA]: nluEnterpriseExportDetails(NLPProvider.ALEXA),
  [NLPProvider.DIALOGFLOW_ES]: nluEnterpriseExportDetails(NLPProvider.DIALOGFLOW_ES),
  [NLPProvider.EINSTEIN]: nluEnterpriseExportDetails(NLPProvider.EINSTEIN),
  [NLPProvider.LEX_V1]: nluEnterpriseExportDetails(NLPProvider.LEX_V1),
  [NLPProvider.LUIS]: nluEnterpriseExportDetails(NLPProvider.LUIS),
  [NLPProvider.NUANCE_MIX]: nluEnterpriseExportDetails(NLPProvider.NUANCE_MIX),
  [NLPProvider.RASA2]: nluEnterpriseExportDetails(NLPProvider.RASA2),
  [NLPProvider.RASA3]: nluEnterpriseExportDetails(NLPProvider.RASA3),
  [NLPProvider.DIALOGFLOW_CX]: nluEnterpriseExportDetails(NLPProvider.DIALOGFLOW_CX),
  [NLPProvider.VF_CSV]: {
    modalTitle: 'CSV Export',
    title: 'Need to export data as CSV?',
    description: `CSV export is a ${TEAM_LABEL} feature. Please upgrade to ${TEAM_LABEL} to continue. `,
    submitText: UPGRADE_TO_TEAM_ACTION_LABEL,
    onSubmit: upgradeToTeamAction,
    tooltipText: `${NLPProviderLabels[NLPProvider.VF_CSV]} is a team feature.`,
    tooltipButtonText: UPGRADE_TO_TEAM_ACTION_LABEL,
    tooltipOnClick: upgradeToTeamAction,
  },
  [NLPProvider.WATSON]: nluEnterpriseExportDetails(NLPProvider.WATSON),
};

export const getNLUExportLimitDetails = (exportType: NLPProvider): LimitDetails => NLUExportLimitDetails[exportType];

export const isGatedNLUExportType = (exportType: NLPProvider, canExport: boolean, canExportCSV: boolean) => {
  return !((canExportCSV && exportType === NLPProvider.VF_CSV) || (canExport && exportType !== NLPProvider.VF_CSV));
};

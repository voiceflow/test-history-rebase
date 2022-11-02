import * as NLU from '@/config/nlu';
import { ENTERPRISE_LABEL, UPGRADE_TO_ENTERPRISE_ACTION_LABEL, upgradeToEnterpriseAction } from '@/config/planLimits';

const GATED_PROJECT_NLUS = new Set<NLU.Constants.NLUType>([
  NLU.Constants.NLUType.LEX,
  NLU.Constants.NLUType.LUIS,
  NLU.Constants.NLUType.RASA,
  NLU.Constants.NLUType.WATSON,
  NLU.Constants.NLUType.EINSTEIN,
  NLU.Constants.NLUType.NUANCE_MIX,
  NLU.Constants.NLUType.DIALOGFLOW_ES,
  NLU.Constants.NLUType.DIALOGFLOW_CX,
]);

const projectNLUEnterpisePlanLimitDetails = (nluType: NLU.Constants.NLUType) => {
  const nlpConfig = NLU.Config.get(nluType).nlps[0];

  return {
    title: 'Upgrade to use this NLU',
    onSubmit: upgradeToEnterpriseAction,
    modalTitle: 'NLU',
    submitText: UPGRADE_TO_ENTERPRISE_ACTION_LABEL,
    description: `${nlpConfig.name} is an ${ENTERPRISE_LABEL} feature. Upgrade to import and export data for this NLU.`,
    tooltipText: `${nlpConfig.name} is a enterprise feature.`,
    tooltipOnClick: upgradeToEnterpriseAction,
    hasLabelTooltip: true,
    labelTooltipText: `Import and export/upload NLU models for ${nlpConfig.name}.`,
    labelTooltipTitle: nlpConfig.name,
    tooltipButtonText: UPGRADE_TO_ENTERPRISE_ACTION_LABEL,
  };
};

export const getProjectNluLimitDetails = (nluType: NLU.Constants.NLUType) =>
  GATED_PROJECT_NLUS.has(nluType) ? projectNLUEnterpisePlanLimitDetails(nluType) : null;

export const isGatedNLUType = (nluType: NLU.Constants.NLUType, canUseCustomNLU: boolean) => !canUseCustomNLU && GATED_PROJECT_NLUS.has(nluType);

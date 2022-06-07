import { PlanType } from '@voiceflow/internal';
import { Utils } from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

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
import { PlatformAndProjectMeta, PlatformAndProjectMetaType } from '@/pages/NewProjectV2/types';

const STARTER_PROJECT_LIMIT = 2;

const NOT_GATED_PROJECT_NLUS = new Set([
  <PlatformAndProjectMetaType>VoiceflowConstants.PlatformType.ALEXA,
  <PlatformAndProjectMetaType>VoiceflowConstants.PlatformType.GOOGLE,
  <PlatformAndProjectMetaType>VoiceflowConstants.PlatformType.VOICEFLOW,
]);

export const ProjectLimitDetails: LimitDetails = {
  modalTitle: 'New Project',
  title: 'Need more projects?',
  description: `You've reached your ${STARTER_PROJECT_LIMIT} free project limit. Upgrade to ${TEAM_LABEL} for unlimited projects.`,
  submitText: UPGRADE_TO_TEAM_ACTION_LABEL,
  onSubmit: upgradeToTeamAction,
};

const projectNLUEnterpisePlanLimitDetails = (nlpExport: NLPProvider) => {
  return {
    modalTitle: 'NLU Export',
    title: 'Upgrade to use this NLU',
    description: `${NLPProviderLabels[nlpExport]} is an ${ENTERPRISE_LABEL} feautre. Upgrade to import and export data for this NLU.`,
    submitText: UPGRADE_TO_ENTERPRISE_ACTION_LABEL,
    onSubmit: upgradeToEnterpriseAction,
  };
};

export const getProjectNluLimitDetails = Utils.platform.createPlatformSelector<LimitDetails>({
  [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: projectNLUEnterpisePlanLimitDetails(NLPProvider.DIALOGFLOW_ES),
  [VoiceflowConstants.PlatformType.EINSTEIN]: projectNLUEnterpisePlanLimitDetails(NLPProvider.EINSTEIN),
  [VoiceflowConstants.PlatformType.LEX]: projectNLUEnterpisePlanLimitDetails(NLPProvider.LEX_V1),
  [VoiceflowConstants.PlatformType.LUIS]: projectNLUEnterpisePlanLimitDetails(NLPProvider.LUIS),
  [VoiceflowConstants.PlatformType.NUANCE_MIX]: projectNLUEnterpisePlanLimitDetails(NLPProvider.NUANCE_MIX),
  [VoiceflowConstants.PlatformType.RASA]: projectNLUEnterpisePlanLimitDetails(NLPProvider.RASA),
  [VoiceflowConstants.PlatformType.WATSON]: projectNLUEnterpisePlanLimitDetails(NLPProvider.WATSON),
});

export const getProjectNLULimitPlan = (): PlanType => PlanType.ENTERPRISE;

export const getProjectNLUTooltipTitle = (option: PlatformAndProjectMeta) => `${option.name} is a enterprise feature.`;

export const isGatedNLUType = (nluType: PlatformAndProjectMetaType, canUseCustomNLU: boolean) =>
  !canUseCustomNLU && !NOT_GATED_PROJECT_NLUS.has(nluType);

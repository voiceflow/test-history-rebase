import { Utils } from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { ExportFormat, ExportType, NLPProvider } from '@/constants';
import { PrototypeRenderSyncOptions } from '@/constants/prototype';

export const CANVAS_EXPORT_OPTIONS = [ExportFormat.VF, ExportFormat.PDF, ExportFormat.PNG, ExportFormat.DIALOGS];

export const CANVAS_EXPORT_OPTIONS_LABELS: Record<ExportFormat, string> = {
  [ExportFormat.PNG]: 'Image (PNG)',
  [ExportFormat.PDF]: 'PDF',
  [ExportFormat.JSON]: 'JSON',
  [ExportFormat.DIALOGS]: 'Dialogs (CSV)',
  [ExportFormat.VF]: 'Project file (JSON)',
};

export const EXPORT_TYPE_OPTIONS = [
  { id: ExportType.MODEL, label: 'NLU data' },
  { id: ExportType.CANVAS, label: 'Project content' },
];

export const NLP_COMPILER_OPTIONS: PrototypeRenderSyncOptions = {
  renderUnusedIntents: true,
};

export const getNlpModelProvider = Utils.platform.createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: [NLPProvider.ALEXA, NLPProvider.VF_CSV],
    [VoiceflowConstants.PlatformType.GOOGLE]: [NLPProvider.DIALOGFLOW_ES, NLPProvider.VF_CSV],
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: [NLPProvider.DIALOGFLOW_ES, NLPProvider.VF_CSV],
    [VoiceflowConstants.PlatformType.RASA]: [NLPProvider.RASA, NLPProvider.VF_CSV],
    [VoiceflowConstants.PlatformType.LEX]: [NLPProvider.LEX_V1, NLPProvider.VF_CSV],
    [VoiceflowConstants.PlatformType.LUIS]: [NLPProvider.LUIS, NLPProvider.VF_CSV],
    [VoiceflowConstants.PlatformType.WATSON]: [NLPProvider.WATSON, NLPProvider.VF_CSV],
    [VoiceflowConstants.PlatformType.NUANCE_MIX]: [NLPProvider.NUANCE_MIX, NLPProvider.VF_CSV],
    [VoiceflowConstants.PlatformType.EINSTEIN]: [NLPProvider.EINSTEIN, NLPProvider.VF_CSV],
  },
  Object.values(NLPProvider)
);

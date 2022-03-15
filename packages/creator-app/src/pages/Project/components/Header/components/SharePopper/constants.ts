import { Utils } from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { ExportFormat, NLPProvider } from '@/constants';

export enum ExportType {
  CANVAS = 'canvas',
  MODEL = 'model',
}

export enum ModelExportConfig {
  MODEL = 'model',
  INTENTS = 'intents',
}

export const MODEL_EXPORT_OPTIONS = [
  { id: ModelExportConfig.MODEL, label: 'Entire Model' },
  { id: ModelExportConfig.INTENTS, label: 'Specific Data' },
];

export const CANVAS_EXPORT_OPTIONS_LABELS: Record<string, string> = {
  [ExportFormat.PNG]: 'Image (PNG)',
  [ExportFormat.PDF]: 'PDF',
  [ExportFormat.DIALOGS]: 'Dialogs (CSV)',
  [ExportFormat.VF]: 'Project file (JSON)',
};

export const CANVAS_EXPORT_OPTIONS = [ExportFormat.VF, ExportFormat.PDF, ExportFormat.PNG, ExportFormat.DIALOGS];

export const CANVAS_OPTIONS_TEMPLATE_WORKSPACE = [ExportFormat.VF];

export const EXPORT_TYPE_OPTIONS = [
  { id: ExportType.MODEL, label: 'NLU data' },
  { id: ExportType.CANVAS, label: 'Project content' },
];

export const getNplModelProvider = Utils.platform.createPlatformSelectorV2(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: [NLPProvider.ALEXA],
    [VoiceflowConstants.PlatformType.GOOGLE]: [NLPProvider.DIALOGFLOW_ES, NLPProvider.VF_CSV],
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: [NLPProvider.DIALOGFLOW_ES, NLPProvider.VF_CSV],
  },
  Object.values(NLPProvider)
);

import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { ExportFormat, NLPProvider } from '@/constants';
import { createPlatformSelector } from '@/utils/platform';

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

export const CANVAS_EXPORT_OPTIONS = [ExportFormat.PDF, ExportFormat.PNG, ExportFormat.DIALOGS, ExportFormat.VF];

export const CANVAS_OPTIONS_TEMPLATE_WORKSPACE = [ExportFormat.VF];

export const EXPORT_TYPE_OPTIONS = [
  { id: ExportType.CANVAS, label: 'Project Content' },
  { id: ExportType.MODEL, label: 'NLP/NLU' },
];

export const getNplModelProvider = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: [NLPProvider.ALEXA],
    [VoiceflowConstants.PlatformType.GOOGLE]: [NLPProvider.DIALOGFLOW_ES],
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT]: [NLPProvider.DIALOGFLOW_ES],
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_VOICE]: [NLPProvider.DIALOGFLOW_ES],
  },
  Object.values(NLPProvider)
);

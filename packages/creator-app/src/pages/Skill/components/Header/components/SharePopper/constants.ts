import { Constants } from '@voiceflow/general-types';

import { ExportFormat, NLPProvider } from '@/constants';
import { createPlatformSelector } from '@/utils/platform';

export enum ExportType {
  CANVAS = 'canvas',
  MODEL = 'model',
}

export const CANVAS_EXPORT_OPTIONS_LABELS: Record<string, string> = {
  [ExportFormat.PNG]: 'Image (PNG)',
  [ExportFormat.PDF]: 'PDF',
  [ExportFormat.VF]: 'Local copy (.vf)',
};

export const CANVAS_EXPORT_OPTIONS = [ExportFormat.PDF, ExportFormat.PNG, ExportFormat.VF];

export const CANVAS_OPTIONS_TEMPLATE_WORKSPACE = [ExportFormat.VF];

export const EXPORT_TYPE_OPTIONS = [
  { id: ExportType.CANVAS, label: 'Project Content' },
  { id: ExportType.MODEL, label: 'NPL/NLU' },
];

export const getNplModelProvider = createPlatformSelector(
  {
    [Constants.PlatformType.ALEXA]: [NLPProvider.ALEXA],
    [Constants.PlatformType.GOOGLE]: [NLPProvider.DIALOGFLOW_ES],
    [Constants.PlatformType.DIALOGFLOW_ES]: [NLPProvider.DIALOGFLOW_ES],
  },
  Object.values(NLPProvider)
);

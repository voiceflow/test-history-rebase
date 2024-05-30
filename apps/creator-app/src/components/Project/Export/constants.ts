import { ExportFormat, ExportType } from '@/constants';
import { PrototypeRenderSyncOptions } from '@/constants/prototype';

export const CANVAS_EXPORT_OPTIONS = [ExportFormat.VF, ExportFormat.PDF, ExportFormat.PNG, ExportFormat.DIALOGS];

export const CANVAS_EXPORT_OPTIONS_LABELS: Record<ExportFormat, string> = {
  [ExportFormat.PNG]: 'Image (PNG)',
  [ExportFormat.PDF]: 'PDF',
  [ExportFormat.JSON]: 'JSON',
  [ExportFormat.DIALOGS]: 'Dialogs (CSV)',
  [ExportFormat.VF]: 'Agent file (JSON)',
};

export const EXPORT_TYPE_OPTIONS = [
  { id: ExportType.MODEL, label: 'NLU data' },
  { id: ExportType.CANVAS, label: 'Agent content' },
];

export const NLP_COMPILER_OPTIONS: PrototypeRenderSyncOptions = {
  renderUnusedIntents: true,
};

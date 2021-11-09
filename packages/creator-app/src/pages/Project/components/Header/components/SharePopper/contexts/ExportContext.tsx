import { Nullable } from '@voiceflow/common';
import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { ExportFormat as CanvasExportFormat, NLPProvider } from '@/constants';
import * as Export from '@/ducks/export';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useSelector, useTrackingEvents } from '@/hooks';

import { ExportType, ModelExportConfig } from '../constants';

interface ExportValue {
  onExport: () => void;
  isExporting: boolean;
  exportType: ExportType;
  setExportType: (exportType: ExportType) => void;
  canvasExportFormat: CanvasExportFormat;
  setCanvasExportFormat: (format: CanvasExportFormat) => void;
  modelExportProvider?: NLPProvider;
  setModelExportProvider: (provider: NLPProvider) => void;
  modelExportConfig: ModelExportConfig;
  setModelExportConfig: (config: ModelExportConfig) => void;
  modelExportIntents: string[];
  setModelExportIntents: (intents: string[]) => void;
}

export const ExportContext = React.createContext<Nullable<ExportValue>>(null);

export const { Consumer: ExportConsumer } = ExportContext;

export const ExportProvider: React.FC = ({ children }) => {
  const exportCanvas = useDispatch(Export.exportCanvas);
  const exportModel = useDispatch(Export.exportModel);
  const isTemplateWorkspace = useSelector(WorkspaceV2.active.isTemplatesSelector);

  const [trackingEvents] = useTrackingEvents();

  const [exportType, setExportType] = React.useState<ExportType>(ExportType.CANVAS);
  const [isExporting, setExporting] = React.useState(false);
  const [canvasExportFormat, setCanvasExportFormat] = React.useState(isTemplateWorkspace ? CanvasExportFormat.VF : CanvasExportFormat.PNG);

  const [modelExportProvider, setModelExportProvider] = React.useState<NLPProvider | undefined>();
  const [modelExportConfig, setModelExportConfig] = React.useState<ModelExportConfig>(ModelExportConfig.MODEL);
  const [modelExportIntents, setModelExportIntents] = React.useState<string[]>([]);

  const onExport = React.useCallback(async () => {
    trackingEvents.trackExportButtonClick({ format: canvasExportFormat });
    setExporting(true);

    if (exportType === ExportType.CANVAS) {
      await exportCanvas(canvasExportFormat);
    } else if (modelExportProvider) {
      await exportModel(modelExportProvider, modelExportIntents);
    }

    setExporting(false);
  }, [exportType, modelExportProvider, modelExportIntents, canvasExportFormat]);

  const api = useContextApi({
    onExport,
    isExporting,
    canvasExportFormat,
    setCanvasExportFormat,
    exportType,
    setExportType,
    modelExportProvider,
    setModelExportProvider,
    modelExportConfig,
    setModelExportConfig,
    modelExportIntents,
    setModelExportIntents,
  });

  return <ExportContext.Provider value={api}>{children}</ExportContext.Provider>;
};

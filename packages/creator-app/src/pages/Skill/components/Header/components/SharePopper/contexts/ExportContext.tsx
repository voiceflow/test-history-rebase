import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { ExportFormat as CanvasExportFormat, NLPProvider } from '@/constants';
import * as Export from '@/ducks/export';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useSelector, useTrackingEvents } from '@/hooks';
import { Nullable } from '@/types';

import { ExportType } from '../constants';

interface ExportValue {
  onExport: () => void;
  isExporting: boolean;
  exportType: ExportType;
  setExportType: (exportType: ExportType) => void;
  canvasExportFormat: CanvasExportFormat;
  setCanvasExportFormat: (format: CanvasExportFormat) => void;
  modelExportProvider?: NLPProvider;
  setModelExportProvider: (provider: NLPProvider) => void;
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

  const onExport = React.useCallback(async () => {
    trackingEvents.trackExportButtonClick({ format: canvasExportFormat });
    setExporting(true);

    if (exportType === ExportType.CANVAS) {
      await exportCanvas(canvasExportFormat);
    } else if (modelExportProvider) {
      await exportModel(modelExportProvider);
    }

    setExporting(false);
  }, [exportType, modelExportProvider, canvasExportFormat]);

  const api = useContextApi({
    onExport,
    isExporting,
    canvasExportFormat,
    setCanvasExportFormat,
    exportType,
    setExportType,
    modelExportProvider,
    setModelExportProvider,
  });

  return <ExportContext.Provider value={api}>{children}</ExportContext.Provider>;
};

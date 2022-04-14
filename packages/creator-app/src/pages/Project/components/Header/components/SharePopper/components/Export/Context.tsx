import { Nullable } from '@voiceflow/common';
import { useContextApi } from '@voiceflow/ui';
import _sortBy from 'lodash/sortBy';
import React from 'react';

import { ExportFormat as CanvasExportFormat, ExportType, NLPProvider, NLPProviderLabels } from '@/constants';
import * as Export from '@/ducks/export';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useSelector, useTrackingEvents } from '@/hooks';
import { PlatformContext } from '@/pages/Project/contexts';
import { isVoiceflowPlatform } from '@/utils/typeGuards';

import { getNplModelProvider } from './constants';

interface ExportValue {
  onExport: () => void;
  exportType: ExportType;
  isExporting: boolean;
  setExportType: (exportType: ExportType) => void;
  nplProviderOptions: NLPProvider[];
  modelExportIntents: string[];
  canvasExportFormat: CanvasExportFormat;
  modelExportProvider?: NLPProvider;
  setModelExportIntents: (intents: string[]) => void;
  setCanvasExportFormat: (format: CanvasExportFormat) => void;
  setModelExportProvider: (provider: NLPProvider) => void;
}

export const ExportContext = React.createContext<Nullable<ExportValue>>(null);

export const { Consumer: ExportConsumer } = ExportContext;

export const ExportProvider: React.FC = ({ children }) => {
  const exportCanvas = useDispatch(Export.exportCanvas);
  const exportModel = useDispatch(Export.exportModel);
  const isTemplateWorkspace = useSelector(WorkspaceV2.active.isTemplatesSelector);

  const [trackingEvents] = useTrackingEvents();
  const platform = React.useContext(PlatformContext)!;
  const [exportType, setExportType] = React.useState<ExportType>(ExportType.MODEL);
  const [isExporting, setExporting] = React.useState(false);
  const [canvasExportFormat, setCanvasExportFormat] = React.useState(isTemplateWorkspace ? CanvasExportFormat.VF : CanvasExportFormat.PNG);

  const nplProviderOptions = React.useMemo(() => {
    // order alphabetically by label
    return _sortBy(getNplModelProvider(platform), (provider) => NLPProviderLabels[provider]);
  }, [platform]);

  const [modelExportProvider, setModelExportProvider] = React.useState<NLPProvider | undefined>(
    !isVoiceflowPlatform(platform) ? nplProviderOptions[0] : undefined
  );
  const [modelExportIntents, setModelExportIntents] = React.useState<string[]>([]);

  const onExport = React.useCallback(async () => {
    trackingEvents.trackExportButtonClick({ format: canvasExportFormat });
    setExporting(true);

    if (exportType === ExportType.CANVAS) {
      await exportCanvas(canvasExportFormat);
    } else if (modelExportProvider) {
      await exportModel(modelExportProvider, modelExportIntents);
    }

    trackingEvents.trackProjectExported({
      template: isTemplateWorkspace,
      platform,
      exportType,
      exportFormat: canvasExportFormat,
    });

    setExporting(false);
  }, [exportType, modelExportProvider, modelExportIntents, canvasExportFormat]);

  const api = useContextApi({
    onExport,
    exportType,
    isExporting,
    setExportType,
    nplProviderOptions,
    canvasExportFormat,
    modelExportIntents,
    modelExportProvider,
    setCanvasExportFormat,
    setModelExportIntents,
    setModelExportProvider,
  });

  return <ExportContext.Provider value={api}>{children}</ExportContext.Provider>;
};
